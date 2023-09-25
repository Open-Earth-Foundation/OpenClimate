import { FunctionComponent, useEffect, useRef, useState } from "react";
import { Card, Collapse } from "@mui/material";
import "./search-bar.page.scss";

import { Search } from "@mui/icons-material";
import { useHistory, useLocation } from "react-router-dom";
import { renderHighlightedName } from "../util/strings";
import { renderDataMissingDropdown } from "../util/showDataMissingDropdown";
import { useMatomo } from "@jonkoops/matomo-tracker-react";

let controller: AbortController | null = null;

const SearchBar: FunctionComponent = () => {
  const [cardExpanded, setCardExpanded] = useState(false);
  const [inputString, setInputString] = useState<string>("");
  const [searchedActors, setSearchedActors] = useState<Array<any>>();
  const [hoverActorIndex, setHoverActorIndex] = useState<number>(-1);
  const history = useHistory();
  const location = useLocation();
  const inputComponentRef = useRef<any>(null);

  const { trackEvent } = useMatomo();

  const handleClickOutside = (event: MouseEvent) => {
    inputComponentRef.current &&
      !inputComponentRef.current.contains(event.target) &&
      setCardExpanded(false);
  };

  const onActorClick = (actor: any) => {
    setCardExpanded(false);
    setInputString("");
    trackEvent({
      category: "Search Bar",
      action: `search-select-${actor.name.toLowerCase()}`,
      name: `${actor.actorId}`,
    });
    history.push(`/actor/${actor.actorId}/${actor.name}_emissions`);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const fetchActors = (searchString: string, controller: any) => {
    let modifiedSearchString = "";
    const searchStringSplit = searchString.split(" ");

    searchStringSplit.map((string, index) => {
      const newString = string.charAt(0).toUpperCase() + string.slice(1);
      if (index === searchStringSplit.length - 1) {
        modifiedSearchString = modifiedSearchString + newString;
      } else {
        modifiedSearchString = modifiedSearchString + newString + " ";
      }
    });

    fetch(
      `https://openclimate.openearth.dev/api/v1/search/actor?q=${modifiedSearchString}`,
      {
        signal: controller.signal,
      }
    )
      .then((res) => res.json())
      .then((json) => {
        let actorData = json.data;
        let actors = actorData.map((actor: any) => {
          const reversePathWithoutEarth = [...actor.root_path_geo]
            .reverse()
            .slice(1);
          return {
            name: actor.name,
            actorId: actor.actor_id,
            type: actor.type,
            data: actor.has_data,
            parentPath: reversePathWithoutEarth,
          };
        });
        setSearchedActors(actors);
      })
      .catch((e) => {
        // doesn't give console error if it's an expected abort
        if (e.name !== "AbortError") {
          console.error(e);
        }
      });
  };

  const renderActorType = (type: string) => {
    switch (type) {
      case "city":
        return "City";
      case "organization":
      case "site":
        return "Company";
      case "adm1":
        return "Region/Province";
      case "country":
      default:
        return "Country";
    }
  };

  const renderParentPath = (path: Array<any>) => {
    let pathString = "";

    path?.map((parent) => {
      if (pathString) {
        pathString = pathString + " > ";
      }
      pathString = pathString + parent.name.toUpperCase();
    });

    return pathString;
  };

  useEffect(() => {
    // cancel previous search results (due to slower server time for <4 letter searches)
    controller && controller.abort();
    if (inputString.length > 2) {
      controller = new AbortController();
      fetchActors(inputString, controller);
    } else if (searchedActors) {
      setSearchedActors([]);
    }
  }, [inputString]);

  useEffect(() => {
    if (cardExpanded) {
      !searchedActors?.length && setCardExpanded(false);
    } else {
      searchedActors?.length && setCardExpanded(true);
    }
  }, [searchedActors]);

  const nonPathActor = (type: string): boolean => {
    switch (type) {
      case "site":
      case "organization":
      case "country":
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="search-bar">
      <Card className="outer-card">
        <Card className="inner-card">
          <div className="content">
            <div className="dropdown">
              <Search />
              <input
                className={
                  inputString ? "dropdown-text" : "dropdown-text-placeholder"
                }
                value={inputString}
                ref={inputComponentRef}
                onClick={() => searchedActors?.length && setCardExpanded(true)}
                placeholder={"Search for any location..."}
                type="text"
                onChange={(event) => setInputString(event.target.value)}
              />
            </div>
          </div>
        </Card>
        <Collapse in={cardExpanded} timeout="auto" unmountOnExit>
          <div className="dropdown-container">
            {searchedActors?.map((option, index) => (
              <div
                className="dropdown-select"
                key={`dropdown-item-${index}`}
                onClick={() => onActorClick(option)}
                onMouseEnter={() => setHoverActorIndex(index)}
                onMouseLeave={() => setHoverActorIndex(-1)}>
                <div>
                  {renderHighlightedName(option.name, inputString)}
                  <div className="dropdown-select-subtitle">
                    {option?.parentPath?.length > 0 &&
                    !nonPathActor(option.type)
                      ? renderParentPath(option.parentPath)
                      : renderActorType(option.type)}
                  </div>
                </div>
                <div className="dropdown-select-missing-container">
                  {renderDataMissingDropdown(
                    hoverActorIndex === index,
                    option?.data === true
                  )}
                </div>
              </div>
            ))}
          </div>
        </Collapse>
      </Card>
    </div>
  );
};

export default SearchBar;
