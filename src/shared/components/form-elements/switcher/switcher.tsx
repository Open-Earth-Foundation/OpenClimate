import React, { FunctionComponent } from 'react'
import { useState } from 'react';
import './switcher.scss';
import LeftChosenPic from '../../../img/form-elements/switcher/left.svg';
import RightChosenPic from '../../../img/form-elements/switcher/right.svg';

interface Props {
    title?: string,
    leftOption: string,
    rightOption: string,
    className?: string,
    leftOptionChosen?:boolean,
    onChange?: () => void
}

const Switcher: FunctionComponent<Props> = (props) => {

    const { title, leftOption, rightOption, className, leftOptionChosen, onChange } = props;

    const defaultLeftOption = leftOptionChosen ? true : false;
    const [ leftChosen, setLeftChosen ] = useState(defaultLeftOption);

    const swticherPic = leftChosen ? LeftChosenPic : RightChosenPic;

    const changeHandler = () => {
        setLeftChosen(!leftChosen);
        
        if(onChange)
            onChange();
    }

    return (
        <div className="switcher">
            <div className="switcher__title title-label">
                <label>{title}</label>
            </div>

            <div className={`switcher__options ${className}`}>
                <div className={`switcher__left-option ${ leftChosen ? "switcher__option_active" : "" }`}>
                    {leftOption}
                </div>
                <div className="switcher__pic" onClick={changeHandler}>
                    <img src={swticherPic} alt="switcher" className="center-pic" />
                </div>
                <div className={`switcher__right-option ${ !leftChosen ? "switcher__option_active" : "" }`}>
                    {rightOption}
                </div>
            </div>
        </div>
    );
}


export default Switcher;
 