import { ReactComponent as DatabaseWarningEmpty } from "../../assets/database-warning.svg";
import { ReactComponent as DatabaseWarningEmptyFilled } from "../../assets/database-warning-white.svg";

export const renderDataMissingDropdown = (isHovered: boolean, hasData: boolean) => {
    if (!hasData) {
        return isHovered ? 
            <>
                <div className={"dropdown-select-missing-text"}>MISSING DATA</div>
                <DatabaseWarningEmptyFilled className="dropdown-select-icon" />
            </>
        :
            <DatabaseWarningEmpty className="dropdown-select-icon" />
    }
    return;
}