import React, { FunctionComponent } from 'react'
import './emissions-grid-row.scss';
import CheckIcon from '../../../../../img/check.png';
import CloseIcon from '../../../../../img/close.png';
import TimeLineIcon from '../../../../../img/timeline.png';

interface IProps  {
    amount: number,
    verified: boolean,
    date?: string,
    timeline?: boolean
}

const EmissionsGridRow: FunctionComponent<IProps> = (props) => {

    const { amount, verified, timeline } = props;

    const useTimeline = timeline ? timeline : false;

    return (
        <div className="emission-row">
            {useTimeline ? 
            <div className="emission-row__timeline">
                <img src={TimeLineIcon} alt="timeline" className="" />
            </div>
            : ""
            }
            <div className="emission-row__content">
                {useTimeline ? 
                <div className="emission-row__timeline-date">
                    09:30 PM June 2019
                </div>
                : ""
                }

                <div className="emission-row__data">
                    <div className="emission-row__emission-amount scope-item-amount">
                        {amount}
                    </div>
                    <div className="emission-row__title">
                        Emissions <br/>
                        Mt CO2e/year
                    </div>
                    <div className="emission-row__description">
                        Forest Clearing
                    </div>
                    <div className="emission-row__scope">
                        <button className="emission-row__btn scope-item-btn scope-item-btn_blue">Scope 1</button>
                    </div>
                    <div className="emission-row__signed-by ">
                        <span className="scope-item-signedby-header">Signed By</span>
                        <span className="scope-item-signedby">British Columbia</span> 
                        {useTimeline ? "" : 
                        <span className="scope-item-signed-date">MAY 25 2019</span>
                        }
                    </div>

                    <div className="emission-row__verified scope-item-verified">
                        {verified ?
                            <React.Fragment>
                                <img src={CheckIcon} alt="verified" className="scope-verified-icon" />
                                Verified by PwC
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <img src={CloseIcon} alt="unverified" className="scope-verified-icon" />
                                Unverified
                            </React.Fragment>
                        }
                    </div>
                </div>
            </div>
            
        </div>


    );
}

export default EmissionsGridRow;
