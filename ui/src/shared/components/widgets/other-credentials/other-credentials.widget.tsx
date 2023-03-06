import React, { FunctionComponent } from "react";
import "./other-credential.widget.scss";

interface Props {
  width: number;
  height: number;
}

const OtherCredentialsWidget: FunctionComponent<Props> = (props) => {
  const { width, height } = props;

  return (
    <div className="widget" style={{ width: width, height: height }}>
      <div className="widget__wrapper">
        <div className="widget__header">
          <div className="widget__title-wrapper">
            <h3 className="widget__title">Other credentials</h3>
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
          <div className="widget__other-credentials">
            <table className="widget__credentials">
              <thead>
                <tr>
                  <th>Certificate ID</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <a href="#" className="widget__credentials-link">
                      06542-308834
                    </a>
                  </td>
                  <td>Production record</td>
                </tr>
                <tr>
                  <td>
                    <a href="#" className="widget__credentials-link">
                      06542-308834
                    </a>
                  </td>
                  <td>Carbon intencity</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherCredentialsWidget;
