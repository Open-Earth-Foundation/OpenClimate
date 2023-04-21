import { FunctionComponent } from "react";
import "./mobile-modal.scss";
import CloseIcon from '@mui/icons-material/Close';


interface Props {
    headerText: string;
    options: Array<string>;
    selectIcon: any;
    getOptionHref: (option: string) => string;
    headerIcon?: any;
    onClose: () => void;
}

export const MobileModalDropdown: FunctionComponent<Props> = (props) => {
    const { headerText, options, selectIcon, headerIcon, getOptionHref, onClose} = props;
    return (
        <div className="mobile-modal">
            <div className="wrapper">
                <div className="header">
                    <div className="header-text">
                        {headerText}
                    </div>
                    <div className="header-icon" onClick={onClose}>
                        {headerIcon || <CloseIcon fontSize="inherit"/>}
                    </div>
                </div>
                {options.map(option => (
                    <a className="select-container" href={getOptionHref(option)} download>
                        <div className="select-icon">{selectIcon}</div>
                        <div className="select-text">{option}</div>
                    </a>
                ))}
            </div>
        </div>
    );
};