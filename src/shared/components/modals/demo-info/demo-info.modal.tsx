import React, { FunctionComponent, useState } from 'react'
import Button from '../../form-elements/button/button';
import './demo-info.modal.scss';

interface Props {
    onModalHide: () => void
}

const DemoInfoModal: FunctionComponent<Props> = (props) => {

    const { onModalHide } = props;

    return (
        <div className="demo-info">
            <div className="modal__content demo-info__content modal__content-btm-mrg">
                <div className="modal__row">
                    You are using a Demo account with Demo Data
                </div>

            </div>
            <div className="modal__row modal__row_btn">
                    <Button 
                            click={onModalHide}
                            color="primary"
                            text="Continue"
                            type="button"
                            />
                </div>
        </div>

    );
}


export default DemoInfoModal;
