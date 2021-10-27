import React, { FunctionComponent } from 'react'
import ITransfer from '../../../../api/models/DTO/Transfer/ITransfer';
import TransferItem from '../../../../shared/components/widgets/transfers/transfer-item/transfer-item';
import TransferArrow from '../../img/transferArrow.png';
import Moment from 'moment'
import './account-transfers.scss';

interface IProps  {
    transfers: Array<any>,
    showModal: (modalType: string) => void
}

const AccountTransfers: FunctionComponent<IProps> = (props) => {

    const { transfers, showModal } = props;

    const transferRows = transfers.map( (t: ITransfer) => {
        
        return (
            <tr key={t.id}>
                <td>
                    <TransferItem 
                        title={t.facility_name} 
                        description={
                        `${t.facility_jurisdiction ? t.facility_jurisdiction + ', ' : ''} ${t.facility_country}`
                        }/>
                </td>
                <td> <img src={TransferArrow} alt="arrow" /> </td>
                <td>
                    <TransferItem 
                        title={t.transfer_receiver_organization} 
                        description={
                            `${t.transfer_receiver_jurisdiction ? t.transfer_receiver_jurisdiction + ', ' : ''} ${t.transfer_receiver_country}`} />
                </td>
                <td>
                    <TransferItem title={t.transfer_goods} description={t.facility_sector_ipcc_activity} />
                </td>
                <td>
                    <TransferItem title={t.transfer_quantity?.toString()} description={t.transfer_quantity_unit}/>
                </td>
                <td>
                    <TransferItem title={t.transfer_carbon_associated?.toString()} description="Tn CO2e"/>
                </td>
                <td>
                    <TransferItem title={Moment(t.transfer_date).format('MMM DD yyyy')}/>
                </td>
                <td>
                    <a href="#" className="account-transfers__link">{t.id}</a>
                </td>
            </tr>
        );
    });

    return (
        <div className="account-transfers">
             <div className="account-transfers__add">
                <button className="add-new" onClick={() => showModal('add-transfer')}>Add new transfer</button>
            </div>

            <table className="account-transfers__table account-table">
                <thead>
                    <tr>
                        <td>From</td>
                        <td></td>
                        <td>To</td>
                        <td>Type</td>
                        <td>Qty</td>
                        <td>Carbon</td>
                        <td>Transfer date</td>
                        <td>Transfer id</td>
                    </tr>
                </thead>
                <tbody>
                    {transferRows}
                </tbody>
            </table>
        </div>
    );
}

export default AccountTransfers;