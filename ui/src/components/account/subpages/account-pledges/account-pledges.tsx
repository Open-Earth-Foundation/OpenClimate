import { FunctionComponent } from "react";
import Moment from "moment";
import IPledge from "../../../../api/models/DTO/Pledge/IPledge";
import "./account-pledges.scss";
import { IUser } from "../../../../api/models/User/IUser";

interface IProps {
  user: IUser;
  showModal: (modalType: string) => void;
  pledges: Array<IPledge>;
}

const AccountPledges: FunctionComponent<IProps> = (props) => {
  const { pledges, user, showModal } = props;
  console.log("Pledges", pledges);
  const pledgesRows = pledges.map((pledge: IPledge) => {
    let pledgeType = "";
    let target = "";

    switch (pledge.credential_type?.toLowerCase()) {
      case "target carbon intensity":
        pledgeType = "Target carbon intensity level";
        target = pledge.pledge_carbon_intensity_target + " MtCO2";
        break;
      case "target carbon intensity reduction":
        pledgeType = "Target carbon intensity reduction";
        target = pledge.pledge_carbon_intensity_reduction + " %";
        break;
      case "target emission":
        pledgeType = "Target emission level";
        target = pledge.pledge_emission_target + " MtCO2";
        break;
      case "target emission reduction":
        pledgeType = "Target emission reduction";
        target = pledge.pledge_emission_reduction + " %";
        break;
    }

    return (
      <tr key={pledge.id}>
        <td className="account-pledges__type">Voluntary</td>
        <td>{pledgeType}</td>
        <td>{target}</td>
        <td>{pledge.pledge_target_year}</td>
        <td>{pledge.pledge_base_year}</td>
        <td>{pledge.pledge_base_level}</td>
        <td className="account-pledges__submitted">
          Last updated {Moment(pledge.credential_issue_date).format("yyyy")}
        </td>
      </tr>
    );
  });

  return (
    <div className="account-pledges">
      <div className="account-pledges__add">
        {user?.demo ? (
          ""
        ) : (
          <button className="add-new" onClick={() => showModal("add-pledge")}>
            Add new pledge
          </button>
        )}
      </div>

      <table className="account-pledges__table account-table">
        <thead>
          <tr>
            <td>Commitment type</td>
            <td>Pledge type</td>
            <td>Target</td>
            <td>Target year</td>
            <td>Base year</td>
            <td>Base level</td>
            <td>Submitted</td>
          </tr>
        </thead>
        <tbody>{pledgesRows}</tbody>
      </table>
    </div>
  );
};

export default AccountPledges;
