import { ArrowDropDown, ArrowDropUp, Search } from "@mui/icons-material";
import { Card, Collapse } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import { ItemDescription } from "semantic-ui-react";

import styles from  "./Select.module.scss";

interface Props {
  label?: string;
  selected?: string;
  disabled?: boolean;
  placeholder?: string;
  items?: Array<string>;
  itemOnClick?: (item: string) => void;
}

export const Select: FC<Props> = (props) => {
  const { label, selected, disabled, placeholder, items, itemOnClick } = props;
  const [selectExpanded, setSelectExpanded] = useState(false);
  const [inputString, setInputString] = useState<string>("");
  const [searchedActors, setSearchedActors] = useState<Array<any>>();
  const [hoverActorIndex, setHoverActorIndex] = useState<number>(-1);

  const inputComponentRef = useRef<any>(null);

  const handleClickOutside = (event: MouseEvent) => {
    inputComponentRef.current &&
      !inputComponentRef.current.contains(event.target) &&
      setSelectExpanded(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.select} onClick={() => setSelectExpanded(!selectExpanded)}>
        <div className={selected ? styles.selected : styles.placeholder}>
          {selected ? selected : placeholder || "Select.."}
        </div>
        {selectExpanded ? (
          <ArrowDropUp className={styles.dropIcon} />
        ) : (
          <ArrowDropDown className={disabled ? "icon-disabled" : "drop-icon"} />
        )}
      </div>
      <Card className={styles.selectItemsUnexpanded} style={!selectExpanded ? { display: "none"} : {display: "inherit"}}>
        <Collapse in={selectExpanded} timeout="auto" unmountOnExit>
            <div className={styles.selectItemsExpanded}>
                {
                    items?.map((option, index) => (
                        <div
                            className={styles.itemContainer}
                            key={`select-item-${index}`}
                            onClick={() => {
                              itemOnClick?.(option);
                              setSelectExpanded(false);
                            }}
                        >
                            {option}
                        </div>
                    ))}
            </div>
        </Collapse>
      </Card>
    </>
  );
};
