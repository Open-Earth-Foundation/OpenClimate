import React, { FunctionComponent } from 'react'
import Moment from 'moment'
import './account-pledges.scss';
import IPledge from '../../../../api/models/DTO/Pledge/IPledge';


interface IProps  {
    showModal: (modalType: string) => void,
    pledges: Array<IPledge>
}

const AccountPledges: FunctionComponent<IProps> = (props) => {

    const { pledges, showModal } = props;
    
    const pledgesRows = pledges.map(pledge => {
        
    let target =  pledge.pledge_emission_target ?? 
    pledge.pledge_carbon_intensity_target ?? pledge.pledge_emission_reduction ?? 
    pledge.pledge_carbon_intensity_reduction;

    return (
        <tr>
            <td className="account-pledges__type">Voluntary</td>
            <td>{target}</td>
            <td>{pledge.pledge_target_year}</td>
            <td className="account-pledges__submitted">Last updated {Moment(pledge.credential_issue_date).format('yyyy')}</td>
        </tr>
    )});

    return (
        <div className="account-pledges">
            <div className="account-pledges__add">
                <button className="add-new" onClick={() => showModal('add-pledge')}>Add new pledge</button>
            </div>

            <table className="account-pledges__table account-table">
                <thead>
                    <tr>
                        <td>Type</td>
                        <td>Target</td>
                        <td>Target year</td>
                        <td>Submitted</td>
                    </tr>
                </thead>
                <tbody>
                    {pledgesRows}
                </tbody>
            </table>
        </div>
    );
}

export default AccountPledges;
 