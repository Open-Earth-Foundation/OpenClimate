import React, {useState, useEffect} from 'react'
import './emissions.page.scss';
import {VscChevronLeft, VscSearch,VscChevronDown, VscChevronUp, VscArrowDown, VscArrowRight} from 'react-icons/vsc'
import {HiSearch} from 'react-icons/hi';
import { Dropdown } from 'semantic-ui-react';

const Emissions = () => {
    const [openAccordion, setOpenAccordion] = useState<boolean>(false)
    const [openAccordion1, setOpenAccordion1] = useState<boolean>(false)
    const [openAccordion2, setOpenAccordion2] = useState<boolean>(false)
    const [openAccordion3, setOpenAccordion3] = useState<boolean>(false)
    const [openAccordion4, setOpenAccordion4] = useState<boolean>(false)
    // Accordion 1
    const handleAccordion = () => {
        setOpenAccordion((p)=>!p)
    }
    // Accordion 2
    const handleAccordion1 = () => {
        setOpenAccordion1((p)=>!p)
    }
    // Accordion 3
    const handleAccordion2 = () => {
        setOpenAccordion2((p)=>!p)
    }
    // Accordion 4
    const handleAccordion3 = () => {
        setOpenAccordion3((p)=>!p)
    }
    // Accordion 5
    const handleAccordion4 = () => {
        setOpenAccordion4((p)=>!p)
    }
    

    return(
        <div className='explore__view-wrapper'>
            <div className='explore__view-header'>
                <div className='explore__country-img'></div>
                <span>Canada</span>
            </div>
            <div className='explore__accordions'>
                <div className='explore__accordion'>
                    <div onClick={handleAccordion} className='explore__accordion-header'>
                        <div>
                            <h4>Emissions Inventory</h4>
                            <p>LAST UPDATED JUNE 2020</p>
                        </div>
                        <div className='explore__icon-2'>
                            { !openAccordion && <VscChevronDown/>}
                            { openAccordion && <VscChevronUp />}
                        </div>
                    </div>
                    {
                        openAccordion && (
                            <div className='explore__accordion-wrapper'>
                                <div className='explore__accordion-content'>
                                    <div className='explore__acccordion-data header'>
                                        <p className='emh'>Total Emissions</p>
                                        <p>Last updated in | Data shown refers to </p>
                                    </div>
                                    <div className='explore__acccordion-data'>
                                        <span className='explore__data-emission red'>763.44</span>
                                        <span>Total GHG emissions</span>
                                        <span>mt CO<sub>2</sub>e/year</span>
                                    </div>
                                    
                                </div>
                                <div className='explore__accordion-content-info'>
                                    <span>See further details in your desktop</span>
                                    <a className='link'>www.openclimate.earth</a>
                                </div>
                            </div>
                        )
                    }
                    <div onClick={handleAccordion1} className='explore__accordion-header'>
                        <div>
                            <h4>Climate Treaties & Agreement</h4>
                            <p>LAST UPDATED JUNE 2020</p>
                        </div>
                        <div className='explore__icon-2'>
                            { !openAccordion1 && <VscChevronDown/>}
                            { openAccordion1 && <VscChevronUp />}
                        </div>
                    </div>
                    {
                        openAccordion1 && (
                            <div className='explore__accordion-wrapper'>
                                <div className='explore__accordion-content'>
                                    <div className='explore__acccordion-trt'>
                                        <p className='trt-text'>UNFCCC Paris Agreement</p>
                                        <p><span>Status</span>: SIGNED AND RAFTED</p>
                                    </div>
                                </div>
                                <div className='explore__accordion-content-info'>
                                    <span>See further details in your desktop</span>
                                    <a className='link'>www.openclimate.earth</a>
                                </div>
                            </div>
                        )
                    }
                    <div onClick={handleAccordion2} className='explore__accordion-header'>
                        <div>
                            <h4>Nested Credentials</h4>
                            <p>LAST UPDATED JUNE 2020</p>
                        </div>
                        <div className='explore__icon-2'>
                            { !openAccordion2 && <VscChevronDown/>}
                            { openAccordion2 && <VscChevronUp />}
                        </div>
                    </div>
                    {
                        openAccordion2 && (
                            <div className='explore__accordion-wrapper'>
                                <div className='explore__accordion-content'>
                                    <div className='explore__acccordion-trt-t'>
                                        <table>
                                            <thead>
                                                <th>
                                                    Certificate ID
                                                </th>
                                                <th>
                                                    Type
                                                </th>
                                                <th>
                                                    Unit
                                                </th>
                                                <th>
                                                    Status
                                                </th>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className='table-id'>
                                                        06542-3308834
                                                    </td>
                                                    <td>
                                                        Emissions
                                                    </td>
                                                    <td>
                                                       CO<sub>2</sub>e
                                                    </td>
                                                    <td>
                                                        Inventory
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className='table-id'>
                                                        06542-3308834
                                                    </td>
                                                    <td>
                                                        Emissions
                                                    </td>
                                                    <td>
                                                       CO<sub>2</sub>e
                                                    </td>
                                                    <td>
                                                        Inventory
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        
                                    </div>
                                </div>
                                
                            </div>
                        )
                    }
                    <div onClick={handleAccordion3} className='explore__accordion-header'>
                        <div>
                            <h4>Pledges</h4>
                            <p>LAST UPDATED JUNE 2020</p>
                        </div>
                        <div className='explore__icon-2'>
                            { !openAccordion3 && <VscChevronDown/>}
                            { openAccordion3 && <VscChevronUp />}
                        </div>
                    </div>
                    {
                        openAccordion3 && (
                            <div className='explore__accordion-wrapper'>
                                <div className='explore__accordion-content'>
                                    <div className='explore__content'>
                                        <p className='contr-heading'>Nationaly Determined Contributions (NDC)</p>
                                        <div className='explore__pledges'>
                                            <div className='ems'>GHG Emissions</div>
                                            <div>
                                                <VscArrowDown className='icon'/>
                                                <span className='sp'>30%</span>
                                            </div>
                                            <div>
                                                <span className='sp2'>by 2030 relative to 2005</span>
                                            </div>
                                        </div>
                                        <p className='contr-heading'>Voluntary</p>
                                        <div className='explore__pledges'>
                                            <div className='ems'>Carbon Intensity</div>
                                            <div>
                                                <VscArrowDown className='icon'/>
                                                <span className='sp'>50%</span>
                                            </div>
                                            <div>
                                                <span className='sp2'>by 2030 relative to 2005</span>
                                            </div>
                                        </div>
                                        <p className='contr-heading'>Voluntary</p>
                                        <div className='explore__pledges'>
                                            <div className='ems'>Carbon Intensity</div>
                                            <div>
                                                <VscArrowDown className='icon'/>
                                                <span className='sp'>00%</span>
                                            </div>
                                            <div>
                                                <span className='sp2'>by 2030 relative to 2005</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    <div onClick={handleAccordion4} className='explore__accordion-header'>
                        <div>
                            <h4>Trades and Transfers</h4>
                            <p>LAST UPDATED JUNE 2020</p>
                        </div>
                        <div className='explore__icon-2'>
                            { !openAccordion4 && <VscChevronDown/>}
                            { openAccordion4 && <VscChevronUp />}
                        </div>
                    </div>
                    {
                        openAccordion4 && (
                            <div className='explore__accordion-wrapper'>
                                <div className='explore__accordion-content'>
                                    <div className='trades-transfers explore__acccordion-trt-t'>
                                        <table>
                                            <thead>
                                                <th>
                                                    From
                                                </th>
                                                <th>
                                                    
                                                </th>
                                                <th>
                                                    To
                                                </th>
                                                <th>
                                                    Type
                                                </th>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className='td'>
                                                        <p>Copper Mountain</p>
                                                        <span>BC, Columbia</span>
                                                    </td>
                                                    <td>
                                                        <VscArrowRight className='icon'/>
                                                    </td>
                                                    <td className='td'>
                                                        <p>Mitsubishi</p>
                                                        <span>Tokyo, Japan</span>
                                                    </td>
                                                    <td className='td'>
                                                        <p>Copper</p>
                                                        <span>Industrial, Comodity</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className='td'>
                                                        <a href='/transfers'>
                                                            <p>Copper</p>
                                                        </a>
                                                        <span>BC, Columbia</span>
                                                    </td>
                                                    <td>
                                                        <VscArrowRight className='icon'/>
                                                    </td>
                                                    <td className='td'>
                                                        <p>Mitsubishi</p>
                                                        <span>Tokyo, Japan</span>
                                                    </td>
                                                    <td className='td'>
                                                        <a href='/transfers'>
                                                            <p>Copper</p>
                                                        </a>
                                                        <span>Industrial, Comodity</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
                
            </div>
        </div>
    )
}

export default Emissions;