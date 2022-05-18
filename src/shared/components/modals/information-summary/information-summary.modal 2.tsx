import React, { FunctionComponent, useState } from 'react'
import InformationModal from '../information/information.modal';
import './information-summary.modal.scss';

interface Props {
    title: string
}

const InformationSummaryModal: FunctionComponent<Props> = (props) => {

    const { title } = props;

    return (
        <div className="information-summary">
            <div className="information-summary__title">{title}</div>
            <div className="information-summary__content">
                <InformationModal subtitle="Emmision Inventory" />
                <InformationModal subtitle="Pledges" />
                <InformationModal subtitle="Climate Treaties & Agreements" />
            </div>
        </div>

    );
}


export default InformationSummaryModal;
