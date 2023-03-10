import React, { useState, FunctionComponent } from "react";
import "./pledges-widget.scss";
import { MdInfoOutline, MdArrowDownward } from "react-icons/md";
import {
  Boy,
  AspectRatio,
  InfoOutlined,
  MonetizationOnOutlined,
  MoreVert,
} from "@mui/icons-material";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import PledgeItem from "./pledge-item";

import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@material-ui/core";
import ProgressBar from "@ramonak/react-progress-bar";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#ffffff",
    color: "#00001F",
    fontFamily: 'Poppins',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    color: "#272727"
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  
  '&:nth-of-type(odd)': {
    backgroundColor: "#FBFBFF",
    border:0
  },
  // hide last border
  '& td, th': {
    border: 0,
  },
 
}));


interface Props {
  current: any;
  parent: any;
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
  const { current, parent } = props;

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
  const targets = current && current.targets ? current.targets : [];
  const lu = targets.map((t: any) => t.last_updated);
  lu.sort();
  const lastUpdated = lu.length > 0 ? lu[lu.length - 1] : null;
  const [lastMonth, lastYear] = lastUpdated
    ? [new Date(lastUpdated).getMonth(), new Date(lastUpdated).getFullYear()]
    : [null, null];
  return (
    <div
      className="pledges-widget"
      style={{ height: targets.length ? "" : "268px" }}
    >
      {targets?.length ? (
        <div className="pledges-widget__wrapper">
          <div className="pledges-widget__metadata">
            <div>
              <div className="pledges-widget__metadata-inner">
                <span className="pledges-widget__title">Pledges</span>
              </div>
              {!lastUpdated && (
                <span className="pledges-widget__last-updated">
                  Last updated {lastMonth != null && monthNames[lastMonth]}{" "}
                  {lastYear}
                </span>
              )}
            </div>
            <div className="pledges-widget__metadata-right">
              <div className="pledges-widget__netzero-text">
                <p>2016</p>
                <span>Net zero target</span>
              </div>
              <div className="pledges-widget__track-status">
                <span>ON TRACK</span>
              </div>
              <div>
                <IconButton className="download_data-button">
                  <MoreVert className="download_data-icon" />
                </IconButton>
              </div>
            </div>
          </div>
          <div className="pledges-widget__pledge-items">
            {/* {targets?.map((pledge: any, index: number) => (
              <PledgeItem pledge={pledge} key={`pledge-item-${index}`} />
            ))} */}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Target commitment</StyledTableCell>
                    <StyledTableCell align="left">Type of commitment</StyledTableCell>
                    <StyledTableCell align="left">% achieved</StyledTableCell>
                    <StyledTableCell align="left"></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {targets.map((target:any) => (
                    <StyledTableRow key={target.target_id}>
                      <StyledTableCell component="th" scope="row" width="20%">
                        <div>
                          <span className="pledges-widget__target-percent">
                            {target.target_value} % &nbsp;
                          </span>
                          <span className="pledges-widget__target-text">
                            by {target.target_year} relative to {target.baseline_year}
                          </span>
                        </div>
                      </StyledTableCell>
                      <StyledTableCell align="left" width="25%">
                        <div className="pledges-widget__commitment">
                          <p>
                            {target.target_type}
                          </p>
                          <span>
                            GHG EMISSIONS
                          </span>
                        </div>
                      </StyledTableCell>
                      <StyledTableCell align="left" width="50%">
                        <div className="pledges-widget__progress-container">
                          <div className="pledges-widget__progress-percent">{ target.percent_achieved && target.percent_achieved > 0 ? `${ target.percent_achieved > 1 ? 100 : Math.round(target.percent_achieved * 100)}%` : 'N/A'}</div>
                          <div className="pledges-widget__progress-progressbar">
                            {
                              target.percent_achieved && target.percent_achieved > 0 ? 
                                <ProgressBar 
                                  completed={target.percent_achieved > 1 ? 100 : Math.round(target.percent_achieved * 100)}
                                  isLabelVisible={false}
                                  height="10px"
                                  width="464px"
                                  borderRadius="0"
                                  bgColor="#4BD300"
                                  baseBgColor="#E6E7FF"
                                  animateOnRender={true} />
                                  :
                                  "N/A"
                            }
                          </div>
                        </div>
                      </StyledTableCell>
                      <StyledTableCell align="right" width="5%">
                        <InfoOutlined className="pledges-widget__target-info"/>
                      </StyledTableCell> 
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

          </div>
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

export default PledgesWidget;
