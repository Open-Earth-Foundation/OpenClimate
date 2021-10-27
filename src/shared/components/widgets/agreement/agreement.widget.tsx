import React, { FunctionComponent } from 'react'
import ITreaties from '../../../../api/models/DTO/Treaties/ITreaties';
import ArrowRightIcon from '../../../img/widgets/arrow-right.svg';
import './agreement.widget.scss';

interface Props {
    treaties?: ITreaties,
    height: number,
    detailsClick: () => void
}

const AgreementWidget: FunctionComponent<Props> = (props) => {
    const { treaties, height, detailsClick} = props;

    const signed = treaties?.signed ? "Signed" : "Not signed";
    const ratified = treaties?.ratified ? "Ratified" : "Not ratified";

    const signedClassName = treaties?.signed ? "widget__status_green" : "widget__status_grey"
    const ratifiedClassName = treaties?.ratified ? "widget__status_green" : "widget__status_grey";

    return (
        <div className="widget" style={{height: height}}>
            <div className="widget__wrapper">

            <div className="widget__header">
                <div className="widget__title-wrapper">
                    <h3 className="widget__title">
                        Climate treaties & Agreement
                    </h3> 
                    <a href="#" className="widget__link" onClick={detailsClick}>Details</a>         
                </div>

                <span className="widget__updated">Last Updated June 2020</span>     
            </div>

            <div className="widget__content" style={{height: `calc(${height}px - 90px)`}}>
                {treaties ? 
                <div className="widget__agreement-content">
                    <div className="widget__content-header">{treaties?.overview_category}</div>
                    <div className="widget__status">Status: 
                        <span className={signedClassName}> {signed} </span>
                        <span className={ratifiedClassName}> & {ratified} </span>
                    </div>
                    <div className="widget__country-dasboard">
                        <a href="#" className="widget__link">
                            See Country Dashboard 
                            <img src={ArrowRightIcon} className="arrow-right"/>
                        </a>
                    </div>
                </div>
                :
                <div className="widget__no-data">
                    No any data
                </div>
                }
            </div>
        </div>
    </div>





    );
}

export default AgreementWidget;
