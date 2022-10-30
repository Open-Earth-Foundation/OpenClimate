import {FunctionComponent} from 'react';
import './pledges-widget.scss';
import {MdArrowDownward} from "react-icons/md";

interface Props {
    pledge: any
}

const PledgeItem: FunctionComponent<Props> = (props) => {
    const {pledge} = props;

    return(
        <div className="pledges-widget__pledges-data">
            <div className="pledges-widget__pledge-entry">
                <div className="pledges-widget__pledge-source">
                    <span>{pledge.datasource_id}</span>
                </div>
                <div className="pledges-widget__pledge-source-info">
                    <div className="pledges-widget__pledge-type">
                        {pledge.target_type}
                    </div>
                    <div className="pledges-widget__pledge-target">
                        <div className="pledges-widget__percentage-value">
                            <MdArrowDownward className="pledges-widget__percentage-arrow"/>
                            {
                                (pledge.target_unit == "percent") &&
                                    <span className="pledges-widget__percentage-value-number">{pledge.target_value}%</span>
                            }
                            {
                                (pledge.target_unit == "tCO2e") &&
                                    <span className="pledges-widget__percentage-value-number">{pledge.target_value}T</span>
                            }
                        </div>
                        <div className="pledges-widget__target-estimate">
                            <div>by {pledge.target_year} relative</div>
                            <div>to {(pledge.baseline_year == pledge.target_year) ? <abbr title='business as usual'>BAU</abbr> : pledge.baseline_year}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default PledgeItem;