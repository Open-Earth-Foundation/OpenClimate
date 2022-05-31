import React, { FunctionComponent } from 'react'
import './add-new-btn.scss';

interface Props {
    onClick?: () => void
}

const AddNewBtn: FunctionComponent<Props> = (props) => {

    const {onClick} = props;
    
    return (
        <button className="review__add-new-btn" onClick={onClick}>
            Add new
        </button>
    );
}


export default AddNewBtn;
 