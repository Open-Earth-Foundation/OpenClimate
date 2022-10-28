import { FunctionComponent, useState } from "react";
import { Card, Collapse } from "@mui/material";
import './level-cards.page.scss'
import { DropdownOption } from "../../../shared/interfaces/dropdown/dropdown-option";
import { Search, ArrowDropDown, ArrowDropUp, HighlightOff, ArrowForwardIos, SwapVert } from '@mui/icons-material'
import { FilterTypes } from "../../../api/models/review/dashboard/filterTypes";



interface Props {
    label: string,
    onSelect?: (option: DropdownOption) => void,
    onDeSelect?: () => void,
    disabled: boolean,
    selectedValue: string,
    options: Array<DropdownOption>,
    onButtonSwap?: () => void,
    isCity?: boolean,
    placeholder?: string,
    buttonDisabled?: boolean
}


const LevelCard: FunctionComponent<Props> = (props) => {
    
    const {label, onSelect, onDeSelect, disabled, selectedValue, options, onButtonSwap, isCity, placeholder, buttonDisabled} = props;
    const [cardExpanded, setCardExpanded] = useState(false);
    const [inputString, setInputString] = useState('');

    const onOptionClick = (option: DropdownOption) => {
        setCardExpanded(false);
        onSelect?.(option);
        setInputString('');
    }

    const renderHighlightedName = (name: string) => {
        const firstIndexMatch = name.toLowerCase().indexOf(inputString.toLowerCase().charAt(0));
        return firstIndexMatch === 0 ? 
            <><b>{name.substring(0, inputString.length)}</b>{name.substring(inputString.length)}</>
            : 
            <>{name.substring(0, firstIndexMatch)}<b>{name.substring(firstIndexMatch, firstIndexMatch + inputString.length)}</b>{name.substring(firstIndexMatch + inputString.length)}</>
    }


    return (
        <div className="level-card">
                <div className="label">{label}</div>
                <Card className="outer-card">
                    <Card className={disabled ? "inner-card-disabled" : "inner-card"}>
                        <div className="content">
                            <div className="dropdown" onClick={() => !disabled && !selectedValue && setCardExpanded(!cardExpanded)}>
                                <Search/>
                                {
                                selectedValue ?
                                    <>
                                        <div className="dropdown-text-selected">{selectedValue}</div>
                                        { 
                                            cardExpanded ? 
                                                <ArrowDropUp className={ disabled ? "icon-disabled" : "drop-icon"} /> 
                                                : 
                                                <ArrowDropDown className={ disabled ? "icon-disabled" : "drop-icon"} /> }
                                        <div className="dropdown-cross-icon" ><HighlightOff className="dropdown-cross-icon" onClick={onDeSelect} /></div>
                                    </>
                                    :
                                    <>
                                        <input className="dropdown-text" placeholder={placeholder || 'Add level'} type='text' onChange={ event => setInputString(event.target.value)} disabled={disabled} />
                                        { cardExpanded ? 
                                            <ArrowDropUp className={ disabled ? "icon-disabled" : "drop-icon"} />
                                            : 
                                            <ArrowDropDown className={ disabled ? "icon-disabled" : "drop-icon"}/> 
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    </Card>
                    <Collapse in={cardExpanded} timeout="auto" unmountOnExit>
                        <div className="dropdown-container">
                            {
                                options.filter(option => option.name.toLowerCase().includes(inputString.toLowerCase())).map((option, index) =>
                                    <div className="dropdown-select" key={`dropdown-item-${index}`} onClick={() => onOptionClick(option)}>
                                        {inputString ? renderHighlightedName(option.name) : option.name}
                                    </div> 
                                    )
                            }
                            
                        </div>
                    </Collapse>
                </Card>
                { onButtonSwap && isCity !== undefined &&
                    <button className={ buttonDisabled ? "swapto-button-disabled" : "swapto-button"} style={ isCity ? {width: '161px', marginLeft: '165px'} : { width: '124px', marginLeft: '200px' }} onClick={() => !buttonDisabled && onButtonSwap()}>
                            <SwapVert sx={{ fontSize: '18px'}} />
                            <div className="button-text">{ isCity ? 'Swap to company' : 'Swap to city'}</div>
                    </button>
                }

        </div>

    )

}

export default LevelCard;