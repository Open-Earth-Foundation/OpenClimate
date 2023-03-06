import { VscArrowRight } from "react-icons/vsc";
import "./transfers.page.scss";

const TransfersPage: React.FunctionComponent = () => {
  return (
    <div className="transfers__wrapper">
      <h3>Transfers Details</h3>
      <div className="transfers__id">
        <span className="sp1">Transfer ID</span>
        <span className="sp2">9583fvassdfr</span>
      </div>
      <div className="table-data">
        <p className="sp1">From / To</p>
        <table>
          <tbody>
            <tr>
              <td className="td">
                <p>Copper Mountain</p>
                <span>BC, Columbia</span>
              </td>
              <td>
                <VscArrowRight className="icon" />
              </td>
              <td className="td">
                <p>Mitsubishi</p>
                <span>Tokyo, Japan</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="status">
        <p>Status</p>
        <span>Pending</span>
      </div>
      <div className="table-data-2">
        <table>
          <thead>
            <th>QTY</th>
            <th>Carbon</th>
          </thead>
          <tbody>
            <tr>
              <td className="td">City</td>

              <td className="td">65 Tn CO2e</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="status">
        <p>Transfer Data</p>
        <span>13 November 2021</span>
      </div>
    </div>
  );
};

export default TransfersPage;
