import React, { FunctionComponent } from 'react'
import './report-item.scss';
import EmptyIcon from '../../../../img/widgets/empty-icon.png';

interface Props {
    title: string,
    description: string
}

const ReportItem: FunctionComponent<Props> = (props) => {

    const { title, description } = props;

    return (
        <div className="widget__report-item">
            <div className="widget__report-icon-wrapper">
                <img alt="icon" src={EmptyIcon} className="widget__report-icon" />
            </div>
            <div className="widget__report-content">
                <div className="widget__report-title">{title}</div>
                <div className="widget__report-description">{description}</div>
            </div>

        </div>
    );
}


export default ReportItem;
