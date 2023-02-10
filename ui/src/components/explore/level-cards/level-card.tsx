import { FunctionComponent, useEffect, useRef, useState } from "react";
import { Card, Collapse } from "@mui/material";
import "./level-cards.page.scss";
import { DropdownOption } from "../../../shared/interfaces/dropdown/dropdown-option";
import {
  Search,
  ArrowDropDown,
  ArrowDropUp,
  HighlightOff,
  ArrowForwardIos,
  SwapVert,
} from "@mui/icons-material";
import { FilterTypes } from "../../../api/models/review/dashboard/filterTypes";
import { renderHighlightedName } from "../../util/strings";
import { ReactComponent as DatabaseWarningEmpty } from "../../../assets/database-warning.svg";
import { ReactComponent as DatabaseWarningEmptyFilled } from "../../../assets/database-warning-white.svg";

interface IProps {
  label: string;
  onSelect?: (option: DropdownOption) => void;
  onDeSelect?: () => void;
  disabled: boolean;
  selectedValue: string;
  options: Array<DropdownOption>;
  onButtonSwap?: () => void;
  isCity?: boolean;
  placeholder?: string;
  buttonDisabled?: boolean;
}

const LevelCard: FunctionComponent<IProps> = (props) => {
  const {
    label,
    onSelect,
    onDeSelect,
    disabled,
    selectedValue,
    options,
    onButtonSwap,
    isCity,
    placeholder,
    buttonDisabled,
  } = props;
  const [cardExpanded, setCardExpanded] = useState(false);
  const [inputString, setInputString] = useState<string>("");
  const [hoveredOptionIndex, setHoveredOptionIndex] = useState<number>(-1);
  const inputComponentRef = useRef<any>(null);

  const handleClickOutside = (event: MouseEvent) => {
    inputComponentRef.current &&
      !inputComponentRef.current.contains(event.target) &&
      setCardExpanded(false);
  };

  const onOptionClick = (option: DropdownOption) => {
    setCardExpanded(false);
    onSelect?.(option);
    setInputString("");
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div className="level-card">
      <div className="label">{label}</div>
      <Card className="outer-card">
        <Card className={disabled ? "inner-card-disabled" : "inner-card"}>
          <div className="content">
            <div
              className="dropdown"
              onClick={() =>
                !disabled && !selectedValue && setCardExpanded(true)
              }
            >
              <Search />
              {selectedValue ? (
                <>
                  <div className="dropdown-text-selected">{selectedValue}</div>
                  {cardExpanded ? (
                    <ArrowDropUp
                      className={disabled ? "icon-disabled" : "drop-icon"}
                    />
                  ) : (
                    <ArrowDropDown
                      className={disabled ? "icon-disabled" : "drop-icon"}
                    />
                  )}
                  <div className="dropdown-cross-icon">
                    <HighlightOff
                      className="dropdown-cross-icon"
                      onClick={onDeSelect}
                    />
                  </div>
                </>
              ) : (
                <>
                  <input
                    className="dropdown-text"
                    ref={inputComponentRef}
                    placeholder={placeholder || "Add level"}
                    type="text"
                    onChange={(event) => setInputString(event.target.value)}
                    disabled={disabled}
                  />
                  {cardExpanded ? (
                    <ArrowDropUp
                      className={disabled ? "icon-disabled" : "drop-icon"}
                    />
                  ) : (
                    <ArrowDropDown
                      className={disabled ? "icon-disabled" : "drop-icon"}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </Card>
        <Collapse in={cardExpanded} timeout="auto" unmountOnExit>
          <div className="dropdown-container" id={"dropdown"}>
            {options
              .filter((option) =>
                option.name.toLowerCase().includes(inputString.toLowerCase())
              )
              .map((option, index) => (
                <div
                  className="dropdown-select"
                  key={`dropdown-item-${index}`}
                  onClick={() => onOptionClick(option)}
                  onMouseEnter={() => setHoveredOptionIndex(index)}
                  onMouseLeave={() => setHoveredOptionIndex(-1)}
                >
                  <div className="dropdown-select-text">
                    {inputString
                      ? renderHighlightedName(option.name, inputString)
                      : option.name}
                  </div>
                  {hoveredOptionIndex === index && option?.data === false ? (
                    <div className="dropdown-select-missing-container">
                      <div className={"dropdown-select-missing-text"}>
                        MISSING DATA
                      </div>
                      <DatabaseWarningEmptyFilled className="dropdown-select-icon" />
                    </div>
                  ) : (
                    !option.data && (
                      <DatabaseWarningEmpty className="dropdown-select-icon" />
                    )
                  )}
                </div>
              ))}
          </div>
        </Collapse>
      </Card>
      {onButtonSwap && isCity !== undefined && (
        <button
          className={
            buttonDisabled ? "swapto-button-disabled" : "swapto-button"
          }
          style={
            isCity
              ? { width: "161px", marginLeft: "165px" }
              : { width: "124px", marginLeft: "200px" }
          }
          onClick={() => !buttonDisabled && onButtonSwap()}
        >
          <SwapVert sx={{ fontSize: "18px" }} />
          <div className="button-text">
            {isCity ? "Swap to company" : "Swap to city"}
          </div>
        </button>
      )}
    </div>
  );
};

export default LevelCard;
