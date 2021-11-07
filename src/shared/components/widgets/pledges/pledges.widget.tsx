import { FunctionComponent } from 'react'
import { NavLink } from 'react-router-dom';
import AddNewBtn from '../../form-elements/add-new-btn/add-new-btn';
import PledgeItem from './pledge-item/pledge-item';
import Moment from 'moment';
import IPledge from '../../../../api/models/DTO/Pledge/IPledge';
import './pledges.widget.scss';

interface Props {
    pledges?: Array<IPledge>,
    detailsLink?: string,
    height: number,
    showAddBtn: boolean,
    voluntary: boolean,
    showModal?: (entityType: string) => void,
    detailsClick?: () => void
}

const PledgesWidget: FunctionComponent<Props> = (props) => {

    const { pledges, detailsLink, height, showAddBtn, voluntary, showModal, detailsClick } = props;

    let lastUpdated = "";

    let pledgeItems;
    if(pledges?.length) {
        pledgeItems = pledges.map((p: IPledge, index: number) => {
            const key = p.id ?? index;
            return (
                <PledgeItem pledge={p} key={key} voluntary={voluntary} />
            )
        });

        //{Moment(lastUpdated).format('MMMM yyyy')}
        //lastUpdated = pledges[pledges.length-1]["Updated"];
    }

    const handlerAddPledge = () => {
        if(showModal)
            showModal('add-pledge');
    }
    
    return (
        <div className="widget" style={{maxHeight: height}}> 
            <div className="widget__wrapper" >
                <div className="widget__header">
                    <div className="widget__title-wrapper">
                        <h3 className="widget__title">
                            Your pledges
                        </h3> 
                        {detailsLink ?
                            <NavLink to={detailsLink} className="widget__link">Details</NavLink>
                            :
                            <a href="#" className="widget__link" onClick={detailsClick}>Details</a>         
                        }
                    </div>

                    <span className="widget__updated">Last Updated June 2020</span>     

                </div>
                <div className="widget__content">
                    {pledges?.length ? 
                    <>
                        <div className="widget__pledges-content">
                            {pledgeItems}
                        </div>
                        {showAddBtn ? 
                            <div className="widget__footer">
                                <AddNewBtn onClick={handlerAddPledge}/>
                            </div>
                            : ""
                        }
                    </>
                    :
                    
                    <div className="widget__no-data" style={{height: `calc(${height}px - 90px)`}}>
                        <div className="widget__no-data-title">
                            No any pledges yet
                        </div>
                        {showAddBtn ?
                            <AddNewBtn onClick={handlerAddPledge}/>
                            : ""
                        }
                    </div>

                    }
                </div>

            </div>
        </div>

    );
}


export default PledgesWidget;