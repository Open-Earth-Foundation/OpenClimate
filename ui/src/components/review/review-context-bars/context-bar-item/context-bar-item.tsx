import React, { Children, FunctionComponent, ReactNode } from 'react'
import ArrowDownGreen from '../../../../shared/img/widgets/arrow_down_green.svg';
import './context-bar-item.scss';

interface Props {
    title?: string,
    children: ReactNode,
    showError?: boolean
}

const ContextBarItem: FunctionComponent<Props> = (props) => {

    const { title, children, showError } = props;

    return (
        <div className="context-bar__item">

            <div className="context-bar__item-title">
                { showError ? 
                <img src={ArrowDownGreen} alt="down" className="context-bar__arrow-icon" />
                : ""
                }
                {title}
            </div>
            <div className="context-bar__item-content">{children}</div>
            
        </div>
    );
}


export default ContextBarItem;
 