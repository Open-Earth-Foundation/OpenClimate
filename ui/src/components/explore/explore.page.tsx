import React, { useState, useEffect } from "react";
import "./explore.page.scss";
import {
  VscChevronLeft,
  VscSearch,
  VscChevronDown,
  VscChevronUp,
  VscArrowDown,
  VscArrowRight,
} from "react-icons/vsc";
import { HiSearch } from "react-icons/hi";
import { Dropdown } from "semantic-ui-react";

const ExplorePage: React.FunctionComponent = () => {
  const [fetchResults, setFetchResults] = useState<boolean>(false);
  const [selectNation, setSelectNation] = useState<boolean>(false);
  const [selectSub, setSelectSub] = useState<boolean>(false);
  const [selectCity, setSelectCity] = useState<boolean>(false);
  const [selectCompany, setSelectCompany] = useState<boolean>(false);
  const [active, setActiveState] = useState<boolean>(true);
  const [active2, setActiveState2] = useState<boolean>(false);
  const [toggleCity, setToggleCity] = useState<boolean>(true);
  const [countryData, setCountryData] = useState<[]>([]);

  const handleActiveState = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setActiveState(true);
    setActiveState2(false);
    setToggleCity(true);
  };

  const handleActiveState2 = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setActiveState(false);
    setActiveState2(true);
    setToggleCity(false);
  };

  const handleDropNation = () => {
    setSelectNation((p) => !p);
  };
  const handleSub = () => {
    setSelectSub((p) => !p);
  };
  const handleDropCity = () => {
    setSelectCity((p) => !p);
  };
  const handleDropCompany = () => {
    setSelectCompany((p) => !p);
  };

  // countries options

  const subnationalOptions = [
    {
      country: "Canada",
      subnational: "Alberta",
    },
    {
      country: "Canada",
      subnational: "British Columbia",
    },
    {
      country: "Canada",
      subnational: "Newfoundland and Labrador",
    },
    {
      country: "Canada",
      subnational: "Northwest Territories",
    },
    {
      country: "Canada",
      subnational: "Prince Edward Island",
    },
    {
      country: "Canada",
      subnational: "Nova Scotia",
    },
  ];
  const cityOptions = [
    {
      subnational: "Alberta",
      city: "Edmonton",
    },
    {
      subnational: "British Colombia",
      city: "Victoria",
    },
    {
      subnational: "Manitoba",
      city: "Winnipeg",
    },
    {
      subnational: "Nova Scotia",
      city: "Halifax",
    },
    {
      subnational: "New Brunswick",
      city: "Fredericton",
    },
  ];
  // const companyOptions = [];

  const [countryOptions, setCountryOptions] = useState<{}[]>([]);

  const [nations, setNations] = useState<any>(countryOptions);
  const [subnationals, setSubnationals] = useState<any>(subnationalOptions);
  const [cities, setCities] = useState<any>(cityOptions);
  const [companies, setCompanies] = useState<any>("");
  const [stateValue, setStateV] = useState<string>();
  const [subValue, setSubV] = useState<string>();
  const [cityValue, setCityV] = useState<string>();
  const [companyValue, setCompanyV] = useState<string>();
  const [nationId, setNationId] = useState<number>();

  // Fetch all countries

  const getAllcountries = async () => {
    const countries = await fetch("/api/country", {
      method: "GET",
    });
    const jsonData = await countries.json();
    console.log(jsonData.data);
    setCountryOptions(jsonData.data);
  };

  useEffect(() => {
    getAllcountries();
  }, []);

  interface INation {
    country_id: number;
    country_name: string;
  }
  interface ISubNation {
    country: string;
    subnational: string;
  }
  interface ICity {
    subnational: string;
    city: string;
  }
  interface ICompany {
    subnational: string;
    company: string;
  }
  const handleFilter = (e: any) => {
    const val = e.target.value;
    const country = countryOptions.filter((v) => {
      console.log(v);
      return Object.values(v).join("").toLocaleLowerCase().includes(val);
    });
    setNations(country);
    console.log(country);
  };
  const handleFilter2 = (e: any) => {
    const val = e.target.value;
    console.log(val);
    const subnational = subnationalOptions.filter((v) => {
      return Object.values(v).join("").toLocaleLowerCase().includes(val);
    });
    setSubnationals(subnational);
    console.log(subnational);
  };

  const handleFilter3 = (e: any) => {
    const val = e.target.value;
    console.log(val);
    const city = cityOptions.filter((v) => {
      return Object.values(v).join("").toLocaleLowerCase().includes(val);
    });
    setCities(city);
    console.log(city);
  };

  const handleFilter4 = (e: any) => {
    const val = e.target.value;
    console.log(val);
    // const company = companyOptions.filter(v => {
    //     return Object.values(v).join('').toLocaleLowerCase().includes(val)
    // });
    // setCities(company)
    // console.log(company)
  };

  const setStateValue = (e: any) => {
    e.preventDefault();
    const nationalId = e.target.getAttribute("data-id");
    setStateV(e.target.value);
    setNationId(nationalId);
    setSelectNation((p) => !p);
    console.log(nationalId);
  };
  const setSubnationValue = (e: any) => {
    e.preventDefault();
    setSubV(e.target.value);

    setSelectSub((p) => !p);
  };
  const setCityValue = (e: any) => {
    e.preventDefault();
    setCityV(e.target.value);

    setSelectCity((p) => !p);
  };
  const setCompanyValue = (e: any) => {
    e.preventDefault();
    setCompanyV(e.target.value);

    setSelectCompany((p) => !p);
  };

  return (
    // Explore Page Main Wrapper
    <div className="explore__wrapper">
      <>
        <div className="explore__header">
          <div className="explore__icon">
            <HiSearch />
          </div>
          <div className="explore-text">Explore by climate actor</div>
        </div>

        <div>
          <form>
            <div className="explore__input-wrapper">
              <label htmlFor="nationState" className="explore__input-label">
                Nation State
              </label>
              <div onClick={handleDropNation} className="explore__input-div">
                <input
                  value={stateValue}
                  id="nationState"
                  className="explore__input-input"
                  placeholder="Select"
                />
                <VscChevronDown />
              </div>
              {selectNation && (
                <div className="explore__dropdown">
                  <div className="explore__filter">
                    <HiSearch className="icon" />
                    <input
                      onChange={handleFilter}
                      type="text"
                      placeholder="Search Country"
                      className="explore__filter-input"
                    />
                  </div>
                  <ul
                    role="menu"
                    className="explore__select"
                    aria-label="Countries"
                  >
                    {nations.map((item: INation) => (
                      <button
                        onClick={setStateValue}
                        className="explore__btn-options"
                        data-id={item.country_id}
                        value={item.country_name}
                      >
                        {item.country_name}
                      </button>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="explore__input-wrapper">
              <label htmlFor="subnational" className="explore__input-label">
                Subnational
              </label>
              <div onClick={handleSub} className="explore__input-div">
                <input
                  value={subValue}
                  id="subnational"
                  className="explore__input-input"
                  placeholder="Select "
                />
                <VscChevronDown />
              </div>
              <div className="explore__button">
                <button
                  onClick={handleActiveState}
                  className={`${active ? "active1" : "inactive1"}`}
                >
                  City
                </button>
                <button
                  onClick={handleActiveState2}
                  className={`${active2 ? "active2" : "inactive2"}`}
                >
                  Company
                </button>
              </div>
              {selectSub && (
                <div className="explore__dropdown">
                  <div className="explore__filter">
                    <HiSearch className="icon" />
                    <input
                      onChange={handleFilter2}
                      type="text"
                      placeholder="Search Subnational"
                      className="explore__filter-input"
                    />
                  </div>
                  <ul
                    role="menu"
                    className="explore__select"
                    aria-label="Countries"
                  >
                    {subnationals.map((item: ISubNation) => {
                      console.log(item);
                      return (
                        <button
                          onClick={setSubnationValue}
                          className="explore__btn-options"
                          value={item.subnational}
                        >
                          {item.subnational}
                        </button>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {toggleCity && (
              <div className="explore__input-wrapper">
                <label htmlFor="city" className="explore__input-label">
                  City
                </label>
                <div onClick={handleDropCity} className="explore__input-div">
                  <input
                    value={cityValue}
                    id="city"
                    className="explore__input-input"
                    placeholder="Select "
                  />
                  <VscChevronDown />
                </div>
                {selectCity && (
                  <div className="explore__dropdown">
                    <div className="explore__filter">
                      <HiSearch className="icon" />
                      <input
                        onChange={handleFilter3}
                        type="text"
                        placeholder="Search City"
                        className="explore__filter-input"
                      />
                    </div>
                    <ul
                      role="menu"
                      className="explore__select"
                      aria-label="Countries"
                    >
                      {cities.map((item: ICity) => {
                        console.log(item);
                        return (
                          <button
                            onClick={setCityValue}
                            className="explore__btn-options"
                            value={item.city}
                          >
                            {item.city}
                          </button>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {!toggleCity && (
              <div className="explore__input-wrapper">
                <label htmlFor="city" className="explore__input-label">
                  Company
                </label>
                <div onClick={handleDropCompany} className="explore__input-div">
                  <input
                    value={companyValue}
                    id="city"
                    className="explore__input-input"
                    placeholder="Select "
                  />
                  <VscChevronDown />
                </div>
                {selectCompany && (
                  <div className="explore__dropdown">
                    <div className="explore__filter">
                      <HiSearch className="icon" />
                      <input
                        onChange={handleFilter4}
                        type="text"
                        placeholder="Search City"
                        className="explore__filter-input"
                      />
                    </div>
                    <ul
                      role="menu"
                      className="explore__select"
                      aria-label="Countries"
                    >
                      {companies.map((item: ICompany) => {
                        console.log(item);
                        return (
                          <button
                            onClick={setCompanyValue}
                            className="explore__btn-options"
                            value={item.company}
                          >
                            {item.company}
                          </button>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <div className="explore__submit-button explore__submit">
              <a href={`/emissions/${nationId}`} className="">
                Explore
              </a>
            </div>
          </form>
        </div>
      </>
    </div>
  );
};

export default ExplorePage;
