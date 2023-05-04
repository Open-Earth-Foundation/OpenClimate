import React, { useState, FunctionComponent, useEffect } from "react";
import "./pledges-widget.scss";
import "./pledges-widget-mobile.scss";
import Popover from "@mui/material/Popover";
import { InfoOutlined, LinkOutlined, MoreVert } from "@mui/icons-material";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@mui/material/Tooltip";

import ProgressBar from "@ramonak/react-progress-bar";
import { readableEmissions } from "../../util/units";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#ffffff",
    color: "#00001F",
    fontFamily: "Poppins",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    color: "#272727",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#FBFBFF",
    border: 0,
  },
  // hide last border
  "& td, th": {
    border: 0,
  },
}));

interface Props {
  current: any;
  currentWidth: number;
  isMobile?: boolean;
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PledgesWidget: FunctionComponent<Props> = (props) => {
  const { current, isMobile, currentWidth } = props;

  const useStyles = makeStyles(() => ({
    customTooltip: {
      backgroundColor: "rgba(44, 44, 44, 1)",
      padding: "10px",
    },
    customArrow: {
      color: "rgba(44, 44, 44, 1)",
    },

    popover: {
      "&.MuiPopover-root > &.MuiPopover-paper": {
        backgroundColor: "red",
      },
    },
  }));

  const classes = useStyles();
  const targets = current && current.targets ? current.targets : [];
  const netZeroTargetYear = targets.filter(
    (target) => target.target_type === "Net zero" || target.target_type === "GHG neutral" || target.target_type === "Climate neutral"
  )?.[0]?.target_year;
  const lu = targets.map((t: any) => t.last_updated);
  lu.sort();
  const lastUpdated = lu.length > 0 ? lu[lu.length - 1] : null;
  const [lastMonth, lastYear] = lastUpdated
    ? [new Date(lastUpdated).getMonth(), new Date(lastUpdated).getFullYear()]
    : [null, null];

  // Popover
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [openedPopoverId, setID] = useState<string | null>("");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: any) => {
    setAnchorEl(event.currentTarget);
    setID(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setID(null);
  };

  const targetCommitmentRender = (targetType: string) => {
    switch (targetType) {
      case "Net zero":
        return "Net Zero";
      case "GHG neutral":
        return "GHG Neutral";
      case "Climate neutral":
        return "Climate Neutral";
      default:
        return "N/A";
    }
  }

  return (
    <div
      className={isMobile ? "pledges-widget-mobile" : "pledges-widget"}
      style={{ height: targets.length ? "" : "268px" }}
      role="pledges-widget"
    >
      {targets?.length ? (
        <div className={`pledges-widget${isMobile ? `-mobile` : ``}__wrapper`}>
          <div className="pledges-widget__metadata">
            <>
              <div className="pledges-widget__metadata-inner">
                <span
                  className={`pledges-widget${
                    isMobile ? `-mobile` : ``
                  }__title`}
                >
                  Pledges
                </span>
              </div>
              {lastUpdated && (
                <span className="pledges-widget__last-updated">
                  Last updated {lastMonth != null && monthNames[lastMonth]}{" "}
                  {lastYear}
                </span>
              )}
            </>
            <>
              {!isMobile && (
                <div className="pledges-widget__netzero-text">
                  <p>{netZeroTargetYear ? netZeroTargetYear : `N/A`}</p>
                  <span>Net Zero Target</span>
                </div>
              )}
            </>
          </div>
          {isMobile && (
            <div className="pledges-widget-mobile__netzero-text">
              <p>{netZeroTargetYear ? netZeroTargetYear : `N/A`}</p>
              <span>Net Zero Target</span>
            </div>
          )}
          {isMobile ? (
            <div className="pledges-widget-mobile__pledge-container">
              {targets.map((target: any) => (
                <div
                  className="pledges-widget-mobile__pledge-item"
                  key={target.target_id}
                >
                  <div className="pledges-widget-mobile__commitment">
                    <p>{target.target_type}</p>
                    <span>GHG Emissions</span>
                  </div>
                  <div className="pledges-widget-mobile__commitment-box">
                    <div className="pledges-widget-mobile__commitment-text">
                      Target commitment
                    </div>
                    <div className="pledges-widget-mobile__commitment-percentage-box">
                      <div className="pledges-widget-mobile__commitment-percentage-text">
                        {target.target_value
                          ? `${
                              target.target_unit === "percent"
                                ? target.target_value
                                : readableEmissions(target.target_value)
                            }${target.target_unit === "percent" ? "%" : ""}`
                          : targetCommitmentRender(target.target_type)}{" "}
                        &nbsp;
                      </div>
                      <div className="pledges-widget-mobile__commitment-relative-text">
                        by {target.target_year}
                        {`${
                          target.baseline_year &&
                          target.target_type !== "Peak of carbon emissions"
                            ? `, relative to ${
                                target.target_type ===
                                "Relative emission reduction"
                                  ? `BAU`
                                  : target.baseline_year
                              }`
                            : ``
                        }`}
                      </div>
                    </div>
                  </div>
                  <div className="pledges-widget-mobile__progress-container">
                    {target.percent_achieved && target.percent_achieved > 0 ? (
                      <ProgressBar
                        completed={
                          target.percent_achieved > 100
                            ? 100
                            : Math.round(target.percent_achieved)
                        }
                        isLabelVisible={false}
                        height="7px"
                        width={ currentWidth < 600 ? '296px' : '504px' }
                        borderRadius="20px"
                        bgColor="#4BD300"
                        baseBgColor="#E6E7FF"
                        animateOnRender={true}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="pledges-widget-mobile__percent-achieved">
                    <div className="pledges-widget-mobile__percent-achieved-text">
                      % commitment achieved
                    </div>
                    <div className="pledges-widget-mobile__percent-achieved-text">
                      {target.percent_achieved && target.percent_achieved > 0
                        ? `${
                            target.percent_achieved > 100
                              ? 100
                              : Math.round(target.percent_achieved)
                          }%`
                        : "N/A"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="pledges-widget__pledge-items">
              <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Target commitment</StyledTableCell>
                      <StyledTableCell align="left">
                        Type of commitment
                      </StyledTableCell>
                      <StyledTableCell align="left">% achieved</StyledTableCell>
                      <StyledTableCell align="left"></StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {targets.map((target: any) => (
                      <StyledTableRow key={target.target_id} role="targetitem" data-testid={`target-${target.target_id}`}>
                        <StyledTableCell component="th" scope="row" width="20%">
                          <div>
                            <span className="pledges-widget__target-percent">
                              {target.target_value
                                ? `${
                                    target.target_unit === "percent"
                                      ? target.target_value
                                      : readableEmissions(target.target_value)
                                  }${
                                    target.target_unit === "percent" ? "%" : ""
                                  }`
                                : targetCommitmentRender(
                                    target.target_type
                                  )}{" "}
                              &nbsp;
                            </span>
                            <span className="pledges-widget__target-text">
                              by {target.target_year}
                              {`${
                                target.baseline_year &&
                                target.target_type !==
                                  "Peak of carbon emissions"
                                  ? `, relative to ${
                                      target.target_type ===
                                      "Relative emission reduction"
                                        ? `BAU`
                                        : target.baseline_year
                                    }`
                                  : ``
                              }`}
                            </span>
                          </div>
                        </StyledTableCell>
                        <StyledTableCell align="left" width="25%">
                          <div className="pledges-widget__commitment">
                            <p>{target.target_type}</p>
                            <span>GHG EMISSIONS</span>
                          </div>
                        </StyledTableCell>
                        <StyledTableCell align="left" width="50%">
                          <div className="pledges-widget__progress-container">
                            <div className="pledges-widget__progress-percent">
                              {target.percent_achieved &&
                              target.percent_achieved > 0
                                ? `${
                                    target.percent_achieved > 100
                                      ? 100
                                      : Math.round(target.percent_achieved)
                                  }%`
                                : "N/A"}
                            </div>
                            <div className="pledges-widget__progress-progressbar">
                              {target.percent_achieved &&
                              target.percent_achieved > 0 ? (
                                <ProgressBar
                                  completed={
                                    target.percent_achieved > 100
                                      ? 100
                                      : Math.round(target.percent_achieved)
                                  }
                                  isLabelVisible={false}
                                  height="10px"
                                  width="504px"
                                  borderRadius="0"
                                  bgColor="#4BD300"
                                  baseBgColor="#E6E7FF"
                                  animateOnRender={true}
                                />
                              ) : (
                                "N/A"
                              )}
                            </div>
                          </div>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <button
                            onClick={(e: any) =>
                              handleClick(e, target.target_id)
                            }
                            aria-describedby="simple-popover"
                            role="popover-button"
                          >
                            <InfoOutlined className="pledges-widget__target-info" />
                          </button>
                          <Popover
                            role="popover-content"
                            id="simple-popover"
                            open={openedPopoverId === target.target_id}
                            anchorEl={anchorEl}
                            classes={{
                              root: "pledges-widget__popover-root",
                              paper: "pledges-widget__popover",
                            }}
                            anchorOrigin={{
                              vertical: "center",
                              horizontal: "left",
                            }}
                            transformOrigin={{
                              vertical: "center",
                              horizontal: "left",
                            }}
                            onClose={handleClose}
                          >
                            <div className="pledges-widget__popover">
                              <div className="pledges-widget__popover-header">
                                <InfoOutlined className="pledges-widget__target-info" />
                                <span role="popover-header-title">{target.target_type}</span>
                              </div>
                              <div className="pledges-widget__popover-body">
                                <div>
                                  <span className="pledges-widget__popover-src-head">
                                    Sources(s)
                                  </span>
                                  <div className="pledges-widget__links-wr">
                                    <LinkOutlined className="pledges-widget__links-icon" />
                                    <span className="pledges-widget__popover-srctxt">
                                      <a href={target.datasource.URL} target="_blank" rel="noopener noreferrer" role="data-source-name">{target.datasource.name}</a>
                                    </span>
                                  </div>

                                  <div className="pledges-widget__popover-achieved-description">
                                    <p className="pledges-widget__popover-src-head">
                                      How do we calculate the % achieved?
                                    </p>
                                    <span>
                                      The percentage achieved is the progress
                                      towards the target (how much this actor
                                      has reduced emissions in comparison to the
                                      target they committed to). We consider the
                                      baseline year, the target year, and the
                                      emissions from both.
                                    </span>
                                  </div>
                                  <div className="pledges-widget__popover-values">
                                    <div className="pledges-widget__popover-values-content">
                                      <div className="pledges-widget__popover-bl-value">
                                        BASELINE VALUE
                                      </div>
                                      <div className="pledges-widget__popover-tns-value" role="baseline-value">
                                        {target.percent_achieved_reason
                                          ? readableEmissions(
                                              target.percent_achieved_reason
                                                .baseline.value
                                            ) + " CO2e"
                                          : "N/A"}
                                      </div>
                                      <div className="pledges-widget__popover-tgt-value" role="baseline-year">
                                        {target.percent_achieved_reason
                                          ? "in " + target.baseline_year
                                          : ""}
                                      </div>
                                    </div>
                                    <div className="pledges-widget__popover-values-content">
                                      <div className="pledges-widget__popover-bl-value">
                                        CURRENT EMISSIONS VALUE
                                      </div>
                                      <div className="pledges-widget__popover-tns-value" role="current-emissions-value">
                                        {target.percent_achieved_reason
                                          ? readableEmissions(
                                              target.percent_achieved_reason
                                                .current.value
                                            ) + " CO2e"
                                          : "N/A"}
                                      </div>
                                      <div className="pledges-widget__popover-tgt-value" role="data-src-name">
                                        {target.percent_achieved_reason
                                          ? target.percent_achieved_reason
                                              .current.datasource.name
                                          : ""}
                                      </div>
                                    </div>
                                    <div className="pledges-widget__popover-values-content">
                                      <div className="pledges-widget__popover-bl-value">
                                        TARGET VALUE
                                      </div>
                                      <div className="pledges-widget__popover-tns-value" role="target-value">
                                        {target.percent_achieved_reason
                                          ? readableEmissions(target.percent_achieved_reason.target.value)
                                           
                                          : `N/A`}
                                      </div>
                                      <div className="pledges-widget__popover-tgt-value" role="target-value-year">
                                        in {target.target_year}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Popover>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </div>
      ) : (
        <div className="pledges-widget__wrapper">
          <div className="pledges-widget__metadata">
            <div>
              <div className="pledges-widget__metadata-inner">
                <span className="pledges-widget__title">Pledges</span>
                <span>
                  <Tooltip
                    classes={{
                      tooltip: classes.customTooltip,
                      arrow: classes.customArrow,
                    }}
                    title={
                      <div className="tooltip">
                        Commitments that the selected actor made
                      </div>
                    }
                    arrow
                    placement="right"
                  >
                    <InfoOutlined className="pledges-widget__icon info-icon" />
                  </Tooltip>
                </span>
              </div>
              <span className="pledges-widget__last-updated"></span>
            </div>
          </div>
          <div className="pledges-widget__pledges-data no-data">
            <div className="pledges-widget__pledges-empty-state">
              <p role="no-data-text">
                There's no data available, if you have any suggested <br /> data
                sources or you are a provider please
              </p>

              <button className="collaborate-cta-btn">
                <Diversity3Icon className="collaborate-cta-icon" />
                <a role="collaborate-text" href="https://docs.google.com/forms/d/e/1FAIpQLSfL2_FpZZr_SfT0eFs_v4T5BsZnrNBbQ4pkbZ51JhJBCcud6A/viewform?pli=1&pli=1">
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

export default PledgesWidget;
