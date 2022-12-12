import { FunctionComponent, useEffect, useRef, useState } from "react";
import { Card, Collapse } from "@mui/material";
import './search-bar.page.scss'

import { Search } from '@mui/icons-material'
import { useHistory, useLocation} from "react-router-dom";
import { renderHighlightedName } from "../util/strings";


let controller: AbortController | null = null;

const SearchBar: FunctionComponent = () => {

    const [cardExpanded, setCardExpanded] = useState(false);
    const [inputString, setInputString] = useState<string>('');
    const [searchedActors, setSearchedActors] = useState<Array<any>>();
    const history = useHistory();
    const location = useLocation();
    const inputComponentRef = useRef<any>(null);

    const handleClickOutside = (event: MouseEvent) => {
        inputComponentRef.current && !inputComponentRef.current.contains(event.target) && setCardExpanded(false);
    }

    const onActorClick = (actor: any) => {
        setCardExpanded(false);
        setInputString('');
        history.push(`/actor/${actor.actorId}`);
    }


    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    const fetchActors = async (searchString: string, controller: any) => {
        fetch(`/api/v1/search/actor?q=${searchString}`, { signal: controller.signal })
                .then(res => res.json())
                .then(json => {
                    let actorData = json.data;
                    let actors = actorData.map((actor:any) => {return {name: actor.name, actorId: actor.actor_id, type: actor.type}});
                    setSearchedActors(actors);
                })
                .catch(e => {
                    // doesn't give console error if it's an expected abort
                    if (e.name !== "AbortError") {
                        console.error(e);
                    }
                })
    }

    const renderActorType = (type: string) => {
        switch(type) {
            case "city":
                return "City";
            case "organization":
                return "Company";
            case "adm1":
                return "Region/Province";
            case "country":
            default:
                return "Country";
          }
    }

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


    return (
        <div className="search-bar">
                <Card className="outer-card">
                    <Card className="inner-card">
                        <div className="content">
                            <div className="dropdown">
                                <Search onClick={() => controller && controller.abort()}/>
                                <input
                                    className="dropdown-text"
                                    value={inputString}
                                    ref={inputComponentRef}
                                    onClick={() => searchedActors?.length && setCardExpanded(true)}
                                    placeholder={'Search for any location...'}
                                    type='text'
                                    onChange={ event => setInputString(event.target.value)} />
                            </div>
                        </div>
                    </Card>
                    <Collapse in={cardExpanded} timeout="auto" unmountOnExit>
                        <div className="dropdown-container">
                            {
                                searchedActors?.map((option, index) =>
                                    <div className="dropdown-select" key={`dropdown-item-${index}`} onClick={() => onActorClick(option)}>
                                        {renderHighlightedName(option.name, inputString)}
                                        <div className="dropdown-select-subtitle">{renderActorType(option.type)}</div>
                                    </div> 
                                    )
                            }
                            
                        </div>
                    </Collapse>
                </Card>

        </div>

    )

}

export default SearchBar;