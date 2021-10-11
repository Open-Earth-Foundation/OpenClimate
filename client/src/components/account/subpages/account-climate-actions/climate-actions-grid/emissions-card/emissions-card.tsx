import React, { FunctionComponent, useState } from 'react'
import EmissionsGrid from '../emissions-grid/emissions-grid';
import EmptyIcon from '../../../../img/empty-icon.png';
import './emissions-card.scss';

interface IProps  {
}

const EmissionsCard: FunctionComponent<IProps> = (props) => {

    return (
        <div className="emissions-card">
            <div className="emissions-card__content">
                <div className="emissions-card__header">
                    <div className="emissions-card__icon">
                        <img src={EmptyIcon} alt="icon" />
                    </div>
                    <div className="emissions-card__title">
                        <h3>Foresty And Land Use</h3>
                        <span className="emissions-card__header-date">Last updated June 2020</span>
                    </div>
                </div>
                <div className="emissions-card__data">
                    <div className="emissions-card__description">
                        Greenhouse gas emissions from the clearing and burning forests, scrublands and savannahs by fire and other methods or removal
                    </div>
                    <div className="emissions-card__total-amount">
                        <div className="emissions-card__amount">1860.32</div>
                        <span className="emissions-card__total-amount-description">Mt CO2e/year</span>
                    </div>
                    <div className="emissions-card__ranking">
                        <div className="emissions-card__ranking-row">
                            <span className="emissions-card__ranking-number">20%</span>
                            Of Total Global Emissions
                        </div>
                        <div className="emissions-card__ranking-row">
                        <span className="emissions-card__ranking-number">1st</span>
                            Leading Contributor
                        </div>
                    </div>
                </div>
            </div>
            <EmissionsGrid />

        </div>
    );
}

export default EmissionsCard;
 