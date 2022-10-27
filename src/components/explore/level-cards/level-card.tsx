import { FunctionComponent, useState } from "react";
import { Card, Collapse } from "@mui/material";
import './level-cards.page.scss'
import { DropdownOption } from "../../../shared/interfaces/dropdown/dropdown-option";
import { Search, ArrowDropDown, ArrowDropUp, HighlightOff, ArrowForwardIos, SwapVert } from '@mui/icons-material'



interface IProps {
    label: string,
    onSelect?: (option: DropdownOption) => void,
    onDeSelect?: () => void,
    disabled: boolean,
    selectedValue: string,
    options: Array<DropdownOption>,
    onButtonSwap?: () => void,
    isCity?: boolean,
    placeholder?: string,
}



const LevelCard: FunctionComponent<IProps> = (props) => {
    
    const {label, onSelect, onDeSelect, disabled, selectedValue, options, onButtonSwap, isCity, placeholder} = props;
    const [cardExpanded, setCardExpanded] = useState(false);
    const [inputString, setInputString] = useState<string>('');

    const onOptionClick = (option: string) => {
        setCardExpanded(false);
        //onSelect
    }

    const renderHighlightedName = (name: string) => {
        const firstIndexMatch = name.toLowerCase().indexOf(inputString.toLowerCase().charAt(0));
        return firstIndexMatch === 0 ? 
            <><b>{inputString}</b>{name.substring(inputString.length)}</> : <>{name.substring(0, firstIndexMatch)}<b>{inputString}</b>{name.substring(firstIndexMatch + inputString.length)}</>
    }


    return (
        <div className={ disabled ? "level-card level-card__disabled" : "level-card"}>
                <div className="label">{label}</div>
                <Card className="outer-card">
                    <Card className="inner-card">
                        <div className="content">
                            <div className="dropdown" onClick={() => !disabled && setCardExpanded(!cardExpanded)}>
                                <Search/>
                                {
                                selectedValue ?
                                    <>
                                        <div className="dropdown-text-selected">{selectedValue}</div>
                                        { cardExpanded ? <ArrowDropUp sx={{color: '#1C1B1F' }} /> : <ArrowDropDown sx={{color: '#1C1B1F' }} /> }
                                        <div className="dropdown-cross-icon" onClick={() => setCardExpanded(false)}><HighlightOff/></div>
                                    </>
                                    :
                                    <>
                                        <input className="dropdown-text" placeholder={placeholder || 'Add level'} type='text' onChange={ event => setInputString(event.target.value)} />
                                        { cardExpanded ? <ArrowDropUp sx={{color: '#1C1B1F' }} /> : <ArrowDropDown sx={{color: '#1C1B1F' }} /> }
                                    </>
                                }
                            </div>
                        </div>
                    </Card>
                    <Collapse in={cardExpanded} timeout="auto" unmountOnExit>
                        <div className="dropdown-container">
                            {
                                options.filter(option => option.name.toLowerCase().includes(inputString.toLowerCase())).map((option, index) =>
                                    <div className="dropdown-select" key={`dropdown-item-${index}`} onClick={() => onOptionClick(option.value)}>
                                        {inputString ? renderHighlightedName(option.name) : option.name}
                                    </div> 
                                    )
                            }
                            
                        </div>
                    </Collapse>
                </Card>
                { onButtonSwap && isCity !== undefined &&
                    <button className="swapto-button" onClick={() => !disabled && onButtonSwap()}>
                            <SwapVert sx={{ fontSize: '18px'}} />
                            { isCity ? 'Swap to company' : 'Swap to city'  }
                    </button>
                }

        </div>

    )

}

export default LevelCard;