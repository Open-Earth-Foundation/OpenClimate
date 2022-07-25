import { DropdownOption } from "../../../../shared/interfaces/dropdown/dropdown-option";
import { FilterTypes } from "./filterTypes";

export interface IReviewFilter {
    title: string,
    type: FilterTypes,
    options: Array<DropdownOption>,
    selectedValue: string,
    isRadio?: boolean 
}