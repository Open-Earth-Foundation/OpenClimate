import React, {useState, useRef} from 'react'
import './explore.page.scss';
import {VscChevronLeft, VscSearch,VscChevronDown, VscChevronUp, VscArrowDown, VscArrowRight} from 'react-icons/vsc'
import {HiSearch} from 'react-icons/hi';
import { Dropdown } from 'semantic-ui-react';


const ExplorePage: React.FunctionComponent = () => {
    const [fetchResults, setFetchResults] = useState<boolean>(false);
    const [selectNation, setSelectNation] = useState<boolean>(false);
    const [selectSub, setSelectSub] = useState<boolean>(false);
    const [selectCity, setSelectCity] = useState<boolean>(false);
    const [selectCompany, setSelectCompany] = useState<boolean>(false);
    const [active, setActiveState] =  useState<boolean>(true);
    const [active2, setActiveState2] =  useState<boolean>(false);
    const [toggleCity, setToggleCity] = useState<boolean>(true)
    

    const handleActiveState  = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
        e.preventDefault();
        setActiveState(true);
        setActiveState2(false);
        setToggleCity(true)
    }

    const handleActiveState2  = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
        e.preventDefault();
        setActiveState(false);
        setActiveState2(true);
        setToggleCity(false)
    }

    const handleDropNation = () => {
        setSelectNation((p)=>!p);
    }
    const handleSub = () => {
        setSelectSub((p)=>!p);
    }
    const handleDropCity = () => {
        setSelectCity((p)=>!p);
    }
    const handleDropCompany = () => {
        setSelectCompany((p)=>!p);
    }

    const handleExplore = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setFetchResults((res)=>!res)
        console.log(fetchResults)
    }

    // countries options
    const countryOptions = [
        { key: 'af', value: 'af', flag: 'af', text: 'Afghanistan' },
        { key: 'ax', value: 'ax', flag: 'ax', text: 'Aland Islands' },
        { key: 'al', value: 'al', flag: 'al', text: 'Albania' },
        { key: 'dz', value: 'dz', flag: 'dz', text: 'Algeria' },
        { key: 'as', value: 'as', flag: 'as', text: 'American Samoa' },
        { key: 'ad', value: 'ad', flag: 'ad', text: 'Andorra' },
        { key: 'ao', value: 'ao', flag: 'ao', text: 'Angola' },
        { key: 'ai', value: 'ai', flag: 'ai', text: 'Anguilla' },
        { key: 'ag', value: 'ag', flag: 'ag', text: 'Antigua' },
        { key: 'ar', value: 'ar', flag: 'ar', text: 'Argentina' },
        { key: 'am', value: 'am', flag: 'am', text: 'Armenia' },
        { key: 'aw', value: 'aw', flag: 'aw', text: 'Aruba' },
        { key: 'au', value: 'au', flag: 'au', text: 'Australia' },
        { key: 'at', value: 'at', flag: 'at', text: 'Austria' },
        { key: 'az', value: 'az', flag: 'az', text: 'Azerbaijan' },
        { key: 'bs', value: 'bs', flag: 'bs', text: 'Bahamas' },
        { key: 'bh', value: 'bh', flag: 'bh', text: 'Bahrain' },
        { key: 'bd', value: 'bd', flag: 'bd', text: 'Bangladesh' },
        { key: 'bb', value: 'bb', flag: 'bb', text: 'Barbados' },
        { key: 'by', value: 'by', flag: 'by', text: 'Belarus' },
        { key: 'be', value: 'be', flag: 'be', text: 'Belgium' },
        { key: 'bz', value: 'bz', flag: 'bz', text: 'Belize' },
        { key: 'bj', value: 'bj', flag: 'bj', text: 'Benin' },
        { key: 'ca', value: 'ca', flag: 'bj', text: 'Canada' },
    ];

    const subnationalOptions = [
        {
            "country": "Canada",
            "subnational": "Alberta"
          },
          {
            "country": "Canada",
            "subnational": "British Columbia"
          },
          {
            "country": "Canada",
            "subnational": "Newfoundland and Labrador"
          },
          {
            "country": "Canada",
            "subnational": "Northwest Territories"
          },
          {
            "country": "Canada",
            "subnational": "Prince Edward Island"
          },
          {
              "country": "Canada",
              "subnational": "Nova Scotia"
          }
    ];
    const cityOptions = [
        {
            "subnational": "Alberta",
            "city": "Edmonton"
          },
          {
            "subnational": "British Colombia",
            "city": "Victoria"
          },
          {
            "subnational": "Manitoba",
            "city": "Winnipeg"
          },
          {
            "subnational": "Nova Scotia",
            "city": "Halifax"
          },
          {
            "subnational": "New Brunswick",
            "city": "Fredericton"
          },
    ];

    const companyOptions = [
        {
            "subnational": "British Columbia",
            "company": "Copper Mountain"
        },
    ];


    const [nations, setNations] = useState<any>(countryOptions);
    const [subnationals, setSubnationals] = useState<any>(subnationalOptions);
    const [cities, setCities] = useState<any>(cityOptions);
    const [companies, setCompanies] = useState<any>(companyOptions);
    const [stateValue, setStateV] = useState<string>();
    const [subValue, setSubV] = useState<string>();
    const [cityValue, setCityV] = useState<string>();
    const [companyValue, setCompanyV] = useState<string>()


    interface INation {
        flag: string,
        key: string,
        text: string,
        value: string
    }
    interface ISubNation {
        country: string,
        subnational: string
    }
    interface ICity {
        subnational: string,
        city: string
    }
    interface ICompany {
        subnational: string,
        company: string
    }
    const handleFilter = (e:any) => {
        const val = e.target.value
        const country = countryOptions.filter(v => {
            return Object.values(v).join('').toLocaleLowerCase().includes(val)
        });
        setNations(country)
        console.log(country)
    }
    const handleFilter2 = (e:any) => {
        const val = e.target.value
        console.log(val)
        const subnational = subnationalOptions.filter(v => {
            return Object.values(v).join('').toLocaleLowerCase().includes(val)
        });
        setSubnationals(subnational)
        console.log(subnational)
    }

    const handleFilter3 = (e:any) => {
        const val = e.target.value
        console.log(val)
        const city = cityOptions.filter(v => {
            return Object.values(v).join('').toLocaleLowerCase().includes(val)
        });
        setCities(city)
        console.log(city)
    }

    const handleFilter4 = (e:any) => {
        const val = e.target.value
        console.log(val)
        const company = companyOptions.filter(v => {
            return Object.values(v).join('').toLocaleLowerCase().includes(val)
        });
        setCities(company)
        console.log(company)
    }

    const setStateValue = (e:any) =>{
        e.preventDefault();
        setStateV(e.target.value)
        
        setSelectNation((p)=>!p);
    }
    const setSubnationValue = (e:any) =>{
        e.preventDefault();
        setSubV(e.target.value)
        
        setSelectSub((p)=>!p);
    }
    const setCityValue = (e:any) =>{
        e.preventDefault();
        setCityV(e.target.value)
        
        setSelectCity((p)=>!p);
    }
    const setCompanyValue = (e:any) =>{
        e.preventDefault();
        setCompanyV(e.target.value)
        
        setSelectCompany((p)=>!p);
    }

    return(
        // Explore Page Main Wrapper
        <div className='explore__wrapper'>
            
            {
                !fetchResults && (
                   <>
                    <div className='explore__header'>
                        <div className='explore__icon'>
                            <HiSearch/>
                        </div>
                        <div className='explore-text'>
                            Explore by climate actor
                        </div>
                    </div>
                  
                    <div>
                        <form>
                            <div className='explore__input-wrapper'>
                                <label htmlFor='nationState' className='explore__input-label'>Nation State</label>
                                <div onClick={handleDropNation} className='explore__input-div'>
                                    <input value={stateValue} id='nationState'  className='explore__input-input' placeholder='Select'/>
                                    <VscChevronDown />
                                </div>
                                {
                                    selectNation && (
                                        <div className='explore__dropdown'>
                                            <div  className='explore__filter'>
                                                <HiSearch className='icon'/>
                                                <input onChange={handleFilter} type="text" placeholder="Search Country" className='explore__filter-input'/>
                                            </div>
                                            <ul role="menu" className='explore__select' aria-label='Countries'>
                                                {
                                                    nations.map((item: INation) =>(
                                                        <button onClick={setStateValue} className='explore__btn-options' value={item.text}>{item.text}</button>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    )
                                }
                            </div>
                            
                            <div className='explore__input-wrapper'>
                                <label htmlFor='subnational' className='explore__input-label'>Subnational</label>
                                <div onClick={handleSub} className='explore__input-div'>
                                    <input value={subValue} id='subnational'  className='explore__input-input' placeholder='Select '/>
                                    <VscChevronDown />
                                </div>
                                <div className='explore__button'>
                                    <button onClick={handleActiveState} className={`${active ? 'active1': 'inactive1'}`}>City</button>
                                    <button onClick={handleActiveState2} className={`${active2 ? 'active2': 'inactive2'}`}>Company</button>
                                </div>
                                {
                                    selectSub && (
                                        <div className='explore__dropdown'>
                                            <div  className='explore__filter'>
                                                <HiSearch className='icon'/>
                                                <input onChange={handleFilter2} type="text" placeholder="Search Subnational" className='explore__filter-input'/>
                                            </div>
                                            <ul role="menu" className='explore__select' aria-label='Countries'>
                                                {
                                                    subnationals.map((item: ISubNation) =>{
                                                        console.log(item)
                                                        return <button onClick={setSubnationValue} className='explore__btn-options' value={item.subnational}>{item.subnational}</button>
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    )
                                }
                            </div>
                            
                            {
                                toggleCity && (
                                    <div className='explore__input-wrapper'>
                                        <label htmlFor='city' className='explore__input-label'>City</label>
                                        <div onClick={handleDropCity} className='explore__input-div'>
                                            <input value={cityValue} id='city'  className='explore__input-input' placeholder='Select '/>
                                            <VscChevronDown />
                                        </div>
                                        {
                                            selectCity && (
                                                <div className='explore__dropdown'>
                                                    <div  className='explore__filter'>
                                                        <HiSearch className='icon'/>
                                                        <input onChange={handleFilter3} type="text" placeholder="Search City" className='explore__filter-input'/>
                                                    </div>
                                                    <ul role="menu" className='explore__select' aria-label='Countries'>
                                                        {
                                                            cities.map((item: ICity) =>{
                                                                console.log(item)
                                                                return <button onClick={setCityValue} className='explore__btn-options' value={item.city}>{item.city}</button>
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            }
                            {
                                !toggleCity && (
                                    <div className='explore__input-wrapper'>
                                        <label htmlFor='city' className='explore__input-label'>Company</label>
                                        <div onClick={handleDropCompany} className='explore__input-div'>
                                            <input value={companyValue} id='city'  className='explore__input-input' placeholder='Select '/>
                                            <VscChevronDown />
                                        </div>
                                        {
                                            selectCompany && (
                                                <div className='explore__dropdown'>
                                                    <div  className='explore__filter'>
                                                        <HiSearch className='icon'/>
                                                        <input onChange={handleFilter4} type="text" placeholder="Search City" className='explore__filter-input'/>
                                                    </div>
                                                    <ul role="menu" className='explore__select' aria-label='Countries'>
                                                        {
                                                            companies.map((item: ICompany) =>{
                                                                console.log(item)
                                                                return <button onClick={setCompanyValue} className='explore__btn-options' value={item.company}>{item.company}</button>
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            }
                            <div className='explore__submit-button'>
                                <button onClick={handleExplore} className='explore__submit'>Explore</button>
                            </div>
                        </form>
                    </div>
                </>
            )
            }
            {
                fetchResults && <ExploreView />
            }
        </div>
    )
}

export default ExplorePage;

const ExploreView: React.FunctionComponent = () => {
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
                                    <div className='explore__acccordion-data'>
                                        <span className='explore__data-emission red'>763.44</span>
                                        <span>Total GHG emissions</span>
                                        <span>mt CO<sub>2</sub>e/year</span>
                                    </div>
                                    <div className='explore__accordion-sign'>-</div>
                                    <div className='explore__acccordion-data'>
                                        <span className='explore__data-emission green'>12.9</span>
                                        <span>Land use sinks</span>
                                        <span>mt CO<sub>2</sub>e/year</span>
                                    </div>
                                    <div className='explore__accordion-sign'>=</div>
                                    <div className='explore__acccordion-data'>
                                        <span className='explore__data-emission red'>750.54</span>
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
