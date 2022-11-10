import { Card, CardContent, Collapse } from "@mui/material";
import { FunctionComponent, useState } from "react";
import './level-cards.page.scss'
import { Search, ArrowDropDown, ArrowDropUp, HighlightOff, ArrowForwardIos, SwapVert } from '@mui/icons-material'



const LevelCardsPage: FunctionComponent = () => {

    const [countryExpanded, setCountryExpanded] = useState(false);
    const [subnationalExpanded, setSubnationalExpanded] = useState(false);
    const [cityExpanded, setCityExpanded] = useState(false);


    const [subnationalSelected, setSubnationalSelected] = useState(false);
    const [countrySelected, setCountrySelected] = useState(false);
    const [citySelected, setCitySelected] = useState(false);

    const [companySelected, setCompanySelected] = useState(false);

    const disabled = { color: "#535572", opacity: ".5"};

    const disabledText = { color: "#7A7B9A", opacity: ".5", pointer: 'default'}

    return (
        <div className="level__card">
            <div className="page">
                <div>
                    <div className="label">Country</div>
                    <Card sx={{ 
                        width: '325px',
                        maxHeight: '367px',
                        borderRadius: '8px'

                    }}>
                        <Card sx={{
                            width: '325px',
                            height: '62px',
                            borderRadius: '8px'

                        }}>
                            <div className="content">
                                <div className="dropdown" onClick={() => setCountryExpanded(!countryExpanded)}>
                                    <Search/>
                                    {
                                    countrySelected ?
                                        <>
                                            <div className="dropdown-text-selected">Canada</div>
                                            { countryExpanded ? <ArrowDropUp sx={{color: '#1C1B1F' }} /> : <ArrowDropDown sx={{color: '#1C1B1F' }} /> }
                                            <div className="dropdown-cross-icon" onClick={() => setCountrySelected(false)}><HighlightOff/></div>
                                        </>
                                        :
                                        <>
                                            <div className="dropdown-text">Add level</div>
                                            { countryExpanded ? <ArrowDropUp sx={{color: '#1C1B1F' }} /> : <ArrowDropDown sx={{color: '#1C1B1F' }} /> }
                                        </>

                                    }
                                </div>
                            </div>
                        </Card>
                        <Collapse in={countryExpanded} timeout="auto" unmountOnExit>
                            <div className="dropdown-select" onClick={() => { setCountrySelected(!countrySelected); setCountryExpanded(false); }}>
                                Canada
                            </div>
                            <div className="dropdown-select">
                                Brazil
                            </div>
                        </Collapse>
                    </Card>
                </div>
                <div className="arrow-forward">
                    <ArrowForwardIos/>
                </div>
                <div>
                    <div className="label">Subnational</div>
                    <Card sx={{ 
                        width: '325px',
                        maxHeight: '367px',
                        borderRadius: '8px'

                    }}>
                        <Card sx={{ 
                            width: '325px',
                            height: '62px',
                            borderRadius: '8px'

                        }}>
                            <div className="content">
                                <div className="dropdown" onClick={() => setSubnationalExpanded(!subnationalExpanded)}>
                                    <Search/>
                                    {
                                    subnationalSelected ?
                                        <>
                                            <div className="dropdown-text-selected">Alberta</div>
                                            { subnationalExpanded ? <ArrowDropUp sx={{color: '#1C1B1F' }} /> : <ArrowDropDown sx={{color: '#1C1B1F' }} /> }
                                            <div className="dropdown-cross-icon" onClick={() => setSubnationalSelected(false)}><HighlightOff/></div>
                                        </>
                                        :
                                        <>
                                            <div className="dropdown-text">Add level</div>
                                            { subnationalExpanded ? <ArrowDropUp sx={{color: '#1C1B1F' }} /> : <ArrowDropDown sx={{color: '#1C1B1F' }} /> }
                                        </>

                                    }
                                </div>
                            </div>
                        </Card>
                        <Collapse in={subnationalExpanded} timeout="auto" unmountOnExit>
                            <div className="dropdown-select" >
                                British Columbia
                            </div>
                            <div className="dropdown-select" onClick={() => { setSubnationalSelected(!subnationalSelected); setSubnationalExpanded(false); }} >
                                Alberta
                            </div>
                        </Collapse>
                    </Card>
                </div>
                <div className="arrow-forward">
                    <ArrowForwardIos/>
                </div>
                <div>
                    <div className="label"> { companySelected ? 'Company' : 'City' }</div>
                    <Card sx={{ 
                        width: '325px',
                        maxHeight: '367px',
                        borderRadius: '8px'

                    }}>
                        <Card sx={{ 
                            width: '325px',
                            height: '62px',
                            borderRadius: '8px'

                        }}>
                            <div className="content">
                                <div className="dropdown" onClick={() => { setCityExpanded(!cityExpanded); }} >
                                    <Search/>
                                    {
                                    citySelected ?
                                        <>
                                            <div className="dropdown-text-selected">Victoria</div>
                                            { cityExpanded ? <ArrowDropUp sx={{color: '#1C1B1F' }} /> : <ArrowDropDown sx={{color: '#1C1B1F' }} /> }
                                            <div className="dropdown-cross-icon" onClick={() => setCitySelected(false)}><HighlightOff/></div>
                                        </>
                                        :
                                        <>
                                            <div className="dropdown-text">Add level</div>
                                            { cityExpanded ? <ArrowDropUp sx={{color: '#1C1B1F' }} /> : <ArrowDropDown sx={{color: '#1C1B1F' }} /> }
                                        </>

                                    }
                                </div>
                            </div>
                        </Card>
                        <Collapse in={cityExpanded} timeout="auto" unmountOnExit>
                            <div className="dropdown-select" onClick={() => { setCitySelected(!citySelected); setCityExpanded(false); }}>
                                Victoria
                            </div>
                        </Collapse>
                    </Card>
                    <button className="swapto-button" onClick={() => setCompanySelected(!companySelected)}>
                        <SwapVert sx={{ fontSize: '18px'}} />
                        { companySelected ? 'Swap to city' : 'Swap to company'  }
                    </button>

                </div>
            </div>
            <div className="page" style={disabledText}>
                <div>
                    <div className="label">Country</div>
                    <Card sx={{ 
                        width: '325px',
                        maxHeight: '367px',
                        borderRadius: '8px'

                    }}>
                        <Card sx={{ 
                            width: '325px',
                            height: '62px',
                            borderRadius: '8px'

                        }}>
                            <div className="content">
                                <div className="dropdown" >
                                    <Search/>
                                    {
                                    countrySelected ?
                                        <>
                                            <div className="dropdown-text-selected">Canada</div>
                                            { countryExpanded ? <ArrowDropUp sx={{color: '#1C1B1F' }} /> : <ArrowDropDown sx={{color: '#1C1B1F' }} /> }
                                            <div className="dropdown-cross-icon" onClick={() => setCountrySelected(false)}><HighlightOff/></div>
                                        </>
                                        :
                                        <>
                                            <div className="dropdown-text">Add level</div>
                                            { countryExpanded ? <ArrowDropUp sx={{color: '#1C1B1F' }} /> : <ArrowDropDown sx={{color: '#1C1B1F' }} /> }
                                        </>

                                    }
                                </div>
                            </div>
                        </Card>
                        <Collapse  timeout="auto" unmountOnExit>
                            <div className="dropdown-select" onClick={() => { setCountrySelected(!countrySelected); setCountryExpanded(false); }}>
                                Canada
                            </div>
                            <div className="dropdown-select">
                                Brazil
                            </div>
                        </Collapse>
                    </Card>
                </div>
                <div className="arrow-forward">
                    <ArrowForwardIos/>
                </div>
                <div>
                    <div className="label">Subnational</div>
                    <Card sx={{ 
                        width: '325px',
                        maxHeight: '367px',
                        borderRadius: '8px'

                    }}>
                        <Card sx={{ 
                            width: '325px',
                            height: '62px',
                            borderRadius: '8px'

                        }}>
                            <div className="content">
                                <div className="dropdown" >
                                    <Search/>
                                    {
                                    subnationalSelected ?
                                        <>
                                            <div className="dropdown-text-selected">Alberta</div>
                                            { subnationalExpanded ? <ArrowDropUp sx={{color: '#1C1B1F' }} /> : <ArrowDropDown sx={{color: '#1C1B1F' }} /> }
                                            <div className="dropdown-cross-icon" onClick={() => setSubnationalSelected(false)}><HighlightOff/></div>
                                        </>
                                        :
                                        <>
                                            <div className="dropdown-text">Add level</div>
                                            { subnationalExpanded ? <ArrowDropUp sx={{color: '#1C1B1F' }} /> : <ArrowDropDown sx={{color: '#1C1B1F' }} /> }
                                        </>

                                    }
                                </div>
                            </div>
                        </Card>
                        <Collapse timeout="auto" unmountOnExit>
                            <div className="dropdown-select" >
                                British Columbia
                            </div>
                            <div className="dropdown-select" onClick={() => { setSubnationalSelected(!subnationalSelected); setSubnationalExpanded(false); }} >
                                Alberta
                            </div>
                        </Collapse>
                    </Card>
                </div>
                <div className="arrow-forward">
                    <ArrowForwardIos/>
                </div>
                <div>
                    <div className="label"> { companySelected ? 'Company' : 'City' }</div>
                    <Card sx={{ 
                        width: '325px',
                        maxHeight: '367px',
                        borderColor: '#24BE00',
                        borderRadius: '8px',
                            borderStyle: 'dotted',
                            '& .MuiCard-root': {
                                borderColor: '#24BE00',
                              },

                    }}>
                        <Card sx={{ 
                            width: '325px',
                            height: '62px',
                            borderRadius: '8px',
                            borderColor: '#24BE00',
                            borderStyle: 'dotted',
                            '& .MuiCard-root': {
                                borderColor: '#24BE00',
                              },

                        }}>
                            <div className="content">
                                <div className="dropdown" >
                                    <Search/>
                                    {
                                    citySelected ?
                                        <>
                                            <div className="dropdown-text-selected">Victoria</div>
                                            { cityExpanded ? <ArrowDropUp sx={{color: '#1C1B1F' }} /> : <ArrowDropDown sx={{color: '#1C1B1F' }} /> }
                                            <div className="dropdown-cross-icon" onClick={() => setCitySelected(false)}><HighlightOff/></div>
                                        </>
                                        :
                                        <>
                                            <div className="dropdown-text">Add level</div>
                                            { cityExpanded ? <ArrowDropUp sx={{color: '#1C1B1F' }} /> : <ArrowDropDown sx={{color: '#1C1B1F' }} /> }
                                        </>

                                    }
                                </div>
                            </div>
                        </Card>
                        <Collapse timeout="auto" unmountOnExit>
                            <div className="dropdown-select" onClick={() => { setCitySelected(!citySelected); setCityExpanded(false); }}>
                                Victoria
                            </div>
                        </Collapse>
                    </Card>
                    <button className="swapto-button" onClick={() => setCompanySelected(!companySelected)}>
                        <SwapVert sx={{ fontSize: '18px'}} />
                        { companySelected ? 'Swap to city' : 'Swap to company'  }
                    </button>

                </div>
            </div>
        </div>
    )

}

export default LevelCardsPage;