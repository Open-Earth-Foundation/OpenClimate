import { FunctionComponent, useEffect, useState } from "react";
import "./emissions-widget.scss";
import {
  MdInfoOutline,
  MdArrowDropDown,
  MdArrowDropUp,
  MdOutlinePeopleAlt,
} from "react-icons/md";
import {
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  Button,
  IconButton,
} from "@mui/material";
import Diversity3Icon from "@mui/icons-material/Diversity3";

import {
  ArrowForwardIos,
  ArrowRightAlt,
  InfoOutlined,
  MoreVert,
} from "@mui/icons-material";

import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@mui/material/Tooltip";

interface Props {
  current: any;
  parent: any;
}

const EmissionsWidget: FunctionComponent<Props> = (props) => {
  const { current } = props;
  const [toggleMenu, setToggleMenu] = useState<boolean>(false);
  // Uncomment when adding Export As
  // const [toggleDownloadAsMenu, setToggleDownloadAsMenu] =
  //   useState<boolean>(false);
  // const [toggleExportAsMenu, setToggleExportAsMenu] = useState<boolean>(false);

  const setMenuState = (event: any) => {
    event.preventDefault();
    setToggleMenu((e) => !e);

    //   if (toggleExportAsMenu) {
    //     setToggleExportAsMenu(false);
    //   }

    //   if (toggleDownloadAsMenu) {
    //     setToggleDownloadAsMenu(false);
    //   }
    // };

    // const setDownloadMenuState = (event: any) => {
    //   event.preventDefault();
    //   setToggleDownloadAsMenu((e) => !e);
    //   if (toggleExportAsMenu) {
    //     setToggleExportAsMenu(false);
    //   }
    // };

    // const setExportMenuState = (event: any) => {
    //   event.preventDefault();
    //   setToggleExportAsMenu((e) => !e);
    //   if (toggleDownloadAsMenu) {
    //     setToggleDownloadAsMenu(false);
    //   }
  };

  const useStyles = makeStyles(() => ({
    customTooltip: {
      backgroundColor: "rgba(44, 44, 44, 1)",
      padding: "10px",
    },
    customArrow: {
      color: "rgba(44, 44, 44, 1)",
    },
  }));

  const classes = useStyles();

  const sources =
    current && current.emissions ? Object.keys(current.emissions) : [];

  sources.sort();

  // get current actor id
  const { actor_id } = current;

  const defaultSource = sources.length > 0 ? sources[0] : null;
  const defaultYear =
    defaultSource && current.emissions[defaultSource].data.length > 0
      ? current.emissions[defaultSource].data[0].year
      : null;
  const latestYear = defaultYear;

  const [currentSource, setCurrentSource] = useState<any>(defaultSource);
  const [currentYear, setCurrentYear] = useState<any>(defaultYear);

  const years = currentSource
    ? current.emissions[currentSource].data.map((e: any) => e.year)
    : [];
  const currentEmissions =
    currentSource && currentYear
      ? current.emissions[currentSource].data.find(
          (e: any) => e.year == currentYear
        )
      : null;
  const lastEmissions =
    currentSource && currentYear
      ? current.emissions[currentSource].data.find(
          (e: any) => e.year == currentYear - 1
        )
      : null;
  const trend =
    currentEmissions && lastEmissions
      ? (currentEmissions.total_emissions - lastEmissions.total_emissions) /
        lastEmissions.total_emissions
      : 0;
  const population =
    currentYear && current.population.length
      ? current.population
          .slice()
          .sort((p: any) => Math.abs(p.year - currentYear))
          .find((p: any) => Math.abs(p.year - currentYear) <= 5)
      : null;
  const perCapita =
    currentEmissions && population
      ? currentEmissions.total_emissions / population.population
      : null;
  const tags = currentSource
    ? currentEmissions
      ? current.emissions[currentSource].tags.concat(currentEmissions.tags)
      : current.emissions[currentSource].tags
    : [];

  const yearChangeHandler = (e: SelectChangeEvent<number>) => {
    const value = e.target.value as number;
    setCurrentYear(value);
  };

  const sourceChangeHandler = (e: SelectChangeEvent<number>) => {
    const source = e.target.value as number;
    // Find the year closest to the current year
    const closest = current.emissions[source].data
      .slice() // make a copy
      .sort(
        (
          a: any,
          b: any // sort by distance from current year
        ) => Math.abs(a.year - currentYear) - Math.abs(b.year - currentYear)
      )
      .shift().year; // pop off the first // and get its year
    setCurrentSource(source);
    setCurrentYear(closest);
  };

  return (
    <div
      className="emissions-widget"
      style={{ height: currentEmissions ? "" : "268px" }}
    >
      {currentEmissions ? (
        <div className="emissions-widget__wrapper">
          <div className="emissions-widget__metadata">
            <div>
              <div className="emissions-widget__metadata-inner">
                <span className="emissions-widget__title">Total emissions</span>
                <span>
                  <Tooltip
                    classes={{
                      tooltip: classes.customTooltip,
                      arrow: classes.customArrow,
                    }}
                    title={
                      <div className="tooltip">
                        GHG emissions emitted by the selected actor during the
                        selected year, according to the selected source
                      </div>
                    }
                    arrow
                    placement="right"
                  >
                    <InfoOutlined className="emissions-widget__icon info-icon" />
                  </Tooltip>
                </span>
              </div>
              {latestYear != 0 && (
                <span className="emissions-widget__last-updated">{`Last updated in ${latestYear}`}</span>
              )}
            </div>
            <div className="emissions-widget__metadata-right">
              <div className="emissions-widget__metadata-right-inner">
                <div className="emissions-widget__source-label">Source</div>
                <div className="emissions-widget__source-title">
                  <FormControl
                    variant="standard"
                    sx={{
                      m: 1,
                      minWidth: 120,
                      margin: "0px",
                      minHeight: 30,
                      fontWeight: "700px",
                    }}
                  >
                    <Select
                      value={currentSource}
                      onChange={sourceChangeHandler}
                      id="demo-simple-select-standard"
                      sx={{
                        border: "0px",
                        fontFamily: "Poppins",
                        fontSize: "10px",
                        position: "relative",
                      }}
                    >
                      {sources.map((source: any, index: number) => (
                        <MenuItem
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: "10px",
                            position: "relative",
                            margin: "0px",
                            fontWeight: "700px",
                          }}
                          key={`emissions-datasource-option-${current.actor_id}-${source}`}
                          value={source}
                        >
                          {current.emissions[source].publisher}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="emissions-widget__metadata-right-inner">
                <div className="emissions-widget__source-label">Year</div>
                <div className="emissions-widget__source-title">
                  <FormControl
                    variant="standard"
                    sx={{
                      m: 1,
                      minWidth: 120,
                      margin: "0px",
                      minHeight: 30,
                      fontWeight: "700px",
                    }}
                  >
                    <Select
                      value={currentYear}
                      onChange={yearChangeHandler}
                      id="demo-simple-select-standard"
                      sx={{
                        border: "0px",
                        fontFamily: "Poppins",
                        fontSize: "10px",
                        position: "relative",
                      }}
                    >
                      {years?.map((year: any, index: number) => (
                        <MenuItem
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: "10px",
                            position: "relative",
                            margin: "0px",
                            fontWeight: "700px",
                          }}
                          key={`emissions-year-option-${current.actor_id}-${currentSource}-${year}`}
                          value={parseInt(year)}
                        >
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="emissions-widget__metadata-right-inner">
                <div className="emissions-widget__button-wrapper">
                  <Tooltip
                    classes={{
                      tooltip: classes.customTooltip,
                      arrow: classes.customArrow,
                    }}
                    title={
                      <div className="tooltip">Download or Export Data</div>
                    }
                    sx={{
                      display: toggleMenu ? "hidden" : "inline",
                    }}
                    arrow
                    placement="right"
                  >
                    <IconButton
                      onClick={setMenuState}
                      className="download_data-button"
                    >
                      <MoreVert className="download_data-icon" />
                    </IconButton>
                  </Tooltip>
                  {toggleMenu && (
                    <>
                      <div className="download_data-menu">
                        <ul className="menu-item">
                          <a
                            className="download-link"
                            href={`/api/v1/download/${actor_id}-emissions.csv`}
                            download
                          >
                            Download as CSV
                          </a>
                          <a
                            className="download-link"
                            href={`/api/v1/download/${actor_id}-emissions.json`}
                            download
                          >
                            Download as JSON
                          </a>
                          {/* Add back when exporting is added
                          <li onClick={setDownloadMenuState}>
                            <span>Download as...</span>
                            <div className="menu-item-arrow">
                              <ArrowForwardIos className="menu-item-arrow-icon" />
                            </div>
                          </li>
                           
                           <li onClick={setExportMenuState}>
                            <span>Export as...</span>
                            <div className="menu-item-arrow">
                              <ArrowForwardIos className="menu-item-arrow-icon" />
                            </div>
                          </li> */}
                        </ul>

                        {/* <ul className="menu-item sub-menu">
                              <li>Download as CSV</li>
                               <li>Download as PDF</li>
                              <li>Download as XML</li> 
                              <li>Download as JSON</li>
                            </ul>
                        
                        
                            <ul className="menu-item sub-menu exportAs">
                              <li>.JPG</li>
                              <li>.PNG</li>
                            </ul> */}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="emissions-widget__data">
            <div className="emissions-widget__emissions-data">
              <div className="emissions-widget__col-1">
                <div>
                  <span className="emissions-widget__total-emissions">
                    {(currentEmissions.total_emissions / 1000000.0).toPrecision(
                      5
                    )}{" "}
                  </span>
                </div>
                {trend != 0 && (
                  <div className="emissions-widget__emissions-trend">
                    {trend > 0 ? (
                      <MdArrowDropUp className="emissions-widget__emissions-trend-icon-up" />
                    ) : (
                      <MdArrowDropDown className="emissions-widget__emissions-trend-icon-down" />
                    )}
                    <span
                      className={
                        trend > 0
                          ? "emissions-widget__emissions-trend-value-red"
                          : "emissions-widget__emissions-trend-value-green"
                      }
                    >{`${trend > 0 ? "+" : ""}${(trend * 100.0).toPrecision(
                      3
                    )}%`}</span>
                    <Tooltip
                      classes={{
                        tooltip: classes.customTooltip,
                        arrow: classes.customArrow,
                      }}
                      title={
                        <div className="tooltip">
                          Evolution compared to the previous year
                        </div>
                      }
                      arrow
                      placement="right"
                    >
                      <InfoOutlined className="emissions-widget__icon trend-icon" />
                    </Tooltip>
                  </div>
                )}
              </div>
              <div>
                <span className="emissions-widget__emissions-description">
                  Total GHG Emissions <br /> Mt CO2e
                </span>
              </div>
            </div>
            {current.type !== "site" && (
              <div className="emissions-widget__emissions-data data-per-capita">
                <div className="icon-wrapper">
                  <MdOutlinePeopleAlt className="people-alt-icon" />
                </div>
                <div>
                  <div className="emissions-widget__col-1">
                    <div className="emissions-widget__row">
                      {perCapita ? (
                        <div>
                          <span className="emissions-widget__total-tonnes-pc">
                            {perCapita.toPrecision(3)}
                          </span>
                          <span className="emissions-widget__emissions-pc-unit">
                            T
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="emissions-widget__total-tonnes-pc no-data">
                            N/A
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="emissions-widget__emissions-trend">
                      <Tooltip
                        classes={{
                          tooltip: classes.customTooltip,
                          arrow: classes.customArrow,
                        }}
                        title={
                          <div className="tooltip">
                            Calculated by Open Climate
                          </div>
                        }
                        arrow
                        placement="right"
                      >
                        <InfoOutlined className="emissions-widget__icon trend-icon" />
                      </Tooltip>
                    </div>
                  </div>
                  <div>
                    <div className="emissions-widget__emissions-description pc-text">
                      Emissions
                    </div>
                    <div className="emissions-widget__emissions-description pc-text">
                      per capita
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="emissions-widget__methodologies">
            <div className="emissions-widget__methodologies-heading">
              <span>Methodologies</span>
              <Tooltip
                classes={{
                  tooltip: classes.customTooltip,
                  arrow: classes.customArrow,
                }}
                title={
                  <div className="tooltip">
                    Type of methodologies utilized by the selected data source
                  </div>
                }
                arrow
                placement="right"
              >
                <InfoOutlined className="emissions-widget__icon methodologies-icon" />
              </Tooltip>
            </div>
            <div className="emissions-widget__methodologies-tags">
              {tags.slice(0, 3).map((tag: any) => (
                <div
                  key={`emissions-tag-${tag.tag_id}`}
                  className="methodologies-tag"
                >
                  {tag.tag_name.length > 24 ? (
                    <Tooltip
                      classes={{
                        tooltip: classes.customTooltip,
                        arrow: classes.customArrow,
                      }}
                      title={<div className="tooltip">{tag.tag_name}</div>}
                      arrow
                      placement="bottom"
                    >
                      <span className="methodologies-text">{tag.tag_name}</span>
                    </Tooltip>
                  ) : (
                    <span className="methodologies-text">{tag.tag_name}</span>
                  )}
                </div>
              ))}
              {tags.slice(3).length > 0 && (
                <div className="methodologies-tag overflow-handler">
                  <span className="methodologies-text">
                    +{tags.slice(3).length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="emissions-widget__wrapper">
          <div className="emissions-widget__metadata">
            <div>
              <div className="emissions-widget__metadata-inner">
                <span className="emissions-widget__title">Total emissions</span>
                <span>
                  <Tooltip
                    classes={{
                      tooltip: classes.customTooltip,
                      arrow: classes.customArrow,
                    }}
                    title={
                      <div className="tooltip">
                        GHG emissions emitted by the selected actor during the
                        selected year, according to the selected source
                      </div>
                    }
                    arrow
                    placement="right"
                  >
                    <InfoOutlined className="emissions-widget__icon info-icon" />
                  </Tooltip>
                </span>
              </div>
            </div>
            <div className="emissions-widget__metadata-right">
              <div className="emissions-widget__metadata-right-inner">
                <div className="emissions-widget__source-label">Source</div>
                <div className="emissions-widget__source-title">
                  <span>N/A</span>
                  <MdArrowDropDown className="emissions-widget__icon arrow" />
                </div>
              </div>
              <div className="emissions-widget__metadata-right-inner">
                <div className="emissions-widget__source-label">Year</div>
                <div className="emissions-widget__source-title">
                  <span>N/A</span>
                  <MdArrowDropDown className="emissions-widget__icon arrow" />
                </div>
              </div>
            </div>
          </div>
          <div className="emissions-widget__data">
            <div className="emissions-widget__emissions-empty-state">
              <p>
                There's no data available, if you have any suggested <br /> data
                sources or you are a provider please
              </p>

              <button className="collaborate-cta-btn">
                <Diversity3Icon className="collaborate-cta-icon" />
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSfL2_FpZZr_SfT0eFs_v4T5BsZnrNBbQ4pkbZ51JhJBCcud6A/viewform?pli=1&pli=1">
                  COLLABORATE WITH DATA
                </a>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmissionsWidget;
