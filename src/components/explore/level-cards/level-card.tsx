import { FunctionComponent, useState } from "react";
import { Card, Collapse } from "@mui/material";
import './level-cards.page.scss'
import { DropdownOption } from "../../../shared/interfaces/dropdown/dropdown-option";
import { Search, ArrowDropDown, ArrowDropUp, HighlightOff, ArrowForwardIos, SwapVert } from '@mui/icons-material'



interface Props {
    label: string,
    onSelect?: (option: DropdownOption) => void,
    onDeSelect?: () => void,
    disabled: boolean,
    selectedValue: string,
    options: Array<string>,
    onButtonSwap?: () => void,
    isCity?: boolean,
    placeholder?: string,
}


const LevelCard: FunctionComponent<Props> = (props) => {
    
    const {label, onSelect, onDeSelect, disabled, selectedValue, options, onButtonSwap, isCity, placeholder} = props;
    const [cardExpanded, setCardExpanded] = useState(false);

    const onOptionClick = (option: string) => {
        setCardExpanded(false);
        //onSelect
    }


    return (
        <div className={ disabled ? "level-card__disabled" : "level-card"}>
                <div className="label">{label}</div>
                <Card className="outer-card">
                    <Card className="inner-card">
                        <div className="content">
                            <div className="dropdown" onClick={() => setCardExpanded(!cardExpanded)}>
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
                                        <div className="dropdown-text">{placeholder || 'Add level'}</div>
                                        { cardExpanded ? <ArrowDropUp sx={{color: '#1C1B1F' }} /> : <ArrowDropDown sx={{color: '#1C1B1F' }} /> }
                                    </>
                                }
                            </div>
                        </div>
                    </Card>
                    <Collapse in={cardExpanded} timeout="auto" unmountOnExit>
                        <div className="dropdown-container">
                            {
                                options.map((option, index) =>
                                    <div className="dropdown-select" key={`dropdown-item-${index}`} onClick={() => onOptionClick(option)}>
                                        {option}
                                    </div> 
                                    )
                            }
                            
                        </div>
                    </Collapse>
                </Card>
                { onButtonSwap && isCity !== undefined &&
                    <button className="swapto-button" onClick={() => onButtonSwap()}>
                            <SwapVert sx={{ fontSize: '18px'}} />
                            { isCity ? 'Swap to company' : 'Swap to city'  }
                    </button>
                }

        </div>

    )

}

export default LevelCard;