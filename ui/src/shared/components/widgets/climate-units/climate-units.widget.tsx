import React, { FunctionComponent } from "react";
import RetiredUnits from "../../../../api/models/review/entity/retired-units";
import "./climate-units.widget.scss";

interface Props {
  retiredUnitsData?: Array<RetiredUnits>;
  height: number;
  detailsClick?: () => void;
}

const ClimateUnitsWidget: FunctionComponent<Props> = (props) => {
  const { retiredUnitsData, height, detailsClick } = props;

  let tableItems = null;
  if (retiredUnitsData) {
    tableItems = retiredUnitsData.map((i) => (
      <tr className="separating_line">
        <td>
          <a href="#" className="review-tile__link">
            {i.certificateId}
          </a>
        </td>
        <td>{i.type}</td>
        <td>{i.unit}</td>
        <td>{i.status}</td>
      </tr>
    ));
  }

  return (
    <div className="widget" style={{ height: height }}>
      <div className="widget__wrapper">
        <div className="widget__header">
          <div className="widget__title-wrapper">
            <h3 className="widget__title">Certified & Retired Climate Units</h3>
            <a href="#" className="widget__link" onClick={detailsClick}>
              See details
            </a>
          </div>

          <span className="widget__updated">Last Updated June 2020</span>
        </div>
        <div
          className="widget__content"
          style={{ height: `calc(${height}px - 90px)` }}
        >
          {retiredUnitsData ? (
            <div className="widget__climte-units-content">
              <table className="widget__climte-units">
                <thead>
                  <tr>
                    <th>Certificate ID</th>
                    <th>Type</th>
                    <th>Unit</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>{tableItems}</tbody>
              </table>
            </div>
          ) : (
            <div className="widget__no-data">No data yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClimateUnitsWidget;
