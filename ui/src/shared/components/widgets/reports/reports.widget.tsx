import React, { FunctionComponent } from "react";
import AddNewBtn from "../../form-elements/add-new-btn/add-new-btn";
import ReportItem from "./report-item/report-item";
import "./reports.widget.scss";

interface Props {
  height: number;
}

const ReportsWidget: FunctionComponent<Props> = (props) => {
  const { height } = props;

  return (
    <div className="widget" style={{ height: height }}>
      <div className="widget__wrapper">
        <div className="widget__header">
          <div className="widget__title-wrapper">
            <h3 className="widget__title">Reports</h3>
            <a href="#" className="widget__link">
              Details
            </a>
          </div>

          <span className="widget__updated">Last Updated June 2020</span>
        </div>
        <div
          className="widget__content"
          style={{ height: `calc(${height}px - 90px)` }}
        >
          <div className="widget__reports-content">
            <ReportItem
              title="Lorem ipsum dolor sit amet"
              description="Lorem ipsum dolor sit amet"
            />
            <ReportItem
              title="Lorem ipsum dolor sit amet"
              description="Lorem ipsum dolor sit amet"
            />
            <ReportItem
              title="Lorem ipsum dolor sit amet"
              description="Lorem ipsum dolor sit amet"
            />
          </div>
          <div className="widget__footer">
            <AddNewBtn />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsWidget;
