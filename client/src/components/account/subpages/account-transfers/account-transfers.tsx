import React, { FunctionComponent } from 'react'
import ITransfer from '../../../../api/models/DTO/Transfer/ITransfer';
import TransferItem from '../../../../shared/components/widgets/transfers/transfer-item/transfer-item';
import TransferArrow from '../../img/transferArrow.png';
import './account-transfers.scss';

interface IStateProps  {
    transfers: Array<any>,
    showModal: (modalType: string) => void
}

interface IDispatchProps {

}

interface IProps extends IStateProps, IDispatchProps {
}

const AccountTransfers: FunctionComponent<IProps> = (props) => {

    const { transfers, showModal } = props;

    const transferRows = transfers.map( (t: ITransfer, i: number) => {
        return (
            <tr key={i}>
                <td>
                    <TransferItem title="Cooper Mountain" description="BC, Canada"/>
                </td>
                <td> <img src={TransferArrow} alt="arrow" /> </td>
                <td>
                    <TransferItem title={t.transfer_receiver_organization} description={t.transfer_receiver_jurisdiction} />
                </td>
                <td>
                    <TransferItem title={t.transfer_goods} description=""/>
                </td>
                <td>
                    <TransferItem title={t.transfer_quantity?.toString()} description="Tn"/>
                </td>
                <td>
                    <TransferItem title={t.transfer_carbon_associated?.toString()} description="Tn CO2e"/>
                </td>
                <td></td>
                <td className="account-transfers__status">
                    <span className="account-transfers__status_success">Success</span>
                </td>
                <td>
                    <a className="account-transfers__link">9385ohku5r24f</a>
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
                        <td>Time</td>
                        <td>Corresponding <br/> Adjustments </td>
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
 