import React, { FunctionComponent } from 'react'
import ITransfer from '../../../../api/models/DTO/Transfer/ITransfer';
import AddNewBtn from '../../form-elements/add-new-btn/add-new-btn';
import Transfer from './transfer/transfer'
import './transfers.widget.scss';

interface Props {
    transfers?: Array<ITransfer>,
    height: number,
    showAddBtn: boolean,
    showModal?: (entityType: string) => void,
    detailsClick?: () => void
}

const TransfersWidget: FunctionComponent<Props> = (props) => {

    const { transfers, height, showAddBtn, showModal, detailsClick } = props;

    let transferItems;

    if(transfers)
        transferItems = transfers.map((t,i) => (
            <Transfer transfer={t} key={i} />
        ));

    const handlerAddTransfer = () => {
        if(showModal)
            showModal('add-transfer');
    }

    return (
        <div className="widget" style={{height: height}}>
        <div className="widget__wrapper" >
            <div className="widget__header">
                <div className="widget__title-wrapper">
                    <h3 className="widget__title">
                        Trades & Transfers
                    </h3> 
                    <a href="#" className="widget__link" onClick={detailsClick}>Details</a>         
                </div>

                <span className="widget__updated">Last Updated June 2020</span>     

            </div>
            <div className="widget__content" style={{height: `calc(${height}px - 90px)`}}>
                { transfers ?
                <React.Fragment>
                    <div className="widget__transfers-content">
                        <div className="widget__transfers-header">
                            <div className="widget__transfers-header-from">From</div>
                            <div className="widget__transfers-header-to">To</div>
                            <div className="widget__transfers-header-type">Type</div>
                        </div>
                        {transferItems}
                    </div>
                    {showAddBtn ?
                        <div className="widget__footer">
                            <AddNewBtn onClick={handlerAddTransfer}/>
                        </div>
                        :""
                        }
                </React.Fragment>

                :
                <div className="widget__no-data">
                    <div className="widget__no-data-title">
                        No any pledges yet
                    </div>
                    {showAddBtn ?
                        <AddNewBtn onClick={handlerAddTransfer}/>
                    :""
                    }
                </div>

                }
            </div>

        </div>
    </div>
    );
}


export default TransfersWidget;
