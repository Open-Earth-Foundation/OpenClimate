import {FunctionComponent} from 'react';
import './pledges-widget.scss';
import {MdArrowDownward} from "react-icons/md";
import IPledge from '../../../api/models/DTO/Pledge/IPledge';

interface Props {
    pledge: IPledge
}

const PledgeItem: FunctionComponent<Props> = (props) => {
    const {pledge} = props;

    
    return(
        <div className="pledges-widget__pledges-data">
            <div className="pledges-widget__pledge-entry">
                <div className="pledges-widget__pledge-source">
                    <span>CDP</span>
                </div>
                <div className="pledges-widget__pledge-source-info">
                    <div className="pledges-widget__pledge-type">
                        CARBON INTENSITY
                    </div>
                    <div className="pledges-widget__pledge-target">
                        <div className="pledges-widget__percentage-value">
                            <MdArrowDownward className="pledges-widget__percentage-arrow"/>
                            <span className="pledges-widget__percentage-value-number">{pledge?.pledge_emission_reduction}%</span>
                        </div>
                        <div className="pledges-widget__target-estimate">
                            <div>by {pledge?.pledge_target_year ?? 2030} relative</div> 
                            <div>to {pledge?.pledge_base_year ?? 2005}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default PledgeItem;