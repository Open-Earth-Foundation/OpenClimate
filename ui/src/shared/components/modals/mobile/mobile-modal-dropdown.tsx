import { FunctionComponent } from "react";
import "./mobile-modal.scss";
import CloseIcon from '@mui/icons-material/Close';
import { Select } from "../../../../stories/Components/Select";


interface Props {
    headerText: string;
    options?: Array<string>;
    selectIcon?: any;
    getOptionHref?: (option: string) => string;
    headerIcon?: any;
    onClose: () => void;
    modalType: string;
    currentSource?: string;
    sources?: Array<string>;
    sourceOnClick?: (source: string) => void;
    currentYear?: string;
    years?: Array<string>;
    yearOnClick?: (year: string) => void;
    onReset?: () => void;
    onApply?: () => void;
}

export const MobileModalDropdown: FunctionComponent<Props> = (props) => {
    const {
        headerText,
        options,
        selectIcon,
        headerIcon,
        getOptionHref,
        onClose,
        modalType,
        currentSource,
        sources,
        sourceOnClick,
        currentYear,
        years,
        yearOnClick,
        onReset,
        onApply} = props;

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
                {
                    modalType === "download" && 
                        options?.map(option => (
                            <a className="select-container" href={getOptionHref?.(option)} download>
                                <div className="select-icon">{selectIcon}</div>
                                <div className="select-text">{option}</div>
                            </a>
                        ))
                }
                {
                    modalType === "filter" &&
                        <>
                        <div className="filters-dropdown-container">
                            <div className="source-filter-container">
                                <Select
                                    label={"Source"}
                                    selected={currentSource}
                                    items={sources}
                                    itemOnClick={sourceOnClick}
                                />
                            </div>
                            <Select
                                label={"Year"}
                                selected={currentYear}
                                items={years}
                                itemOnClick={yearOnClick}
                            />
                        </div>
                        <div className="button-container">
                            <div className="reset-text" onClick={() => onReset?.()}>Reset</div>
                            <button className="button" onClick={() => onApply?.()}><span>Apply</span></button>
                        </div>
                        </>
                        
                }
            </div>
        </div>
    );
};