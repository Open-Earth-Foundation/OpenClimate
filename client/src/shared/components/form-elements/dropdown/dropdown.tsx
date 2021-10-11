import React, { ForwardedRef, forwardRef, FunctionComponent, useEffect } from 'react'
import { useState } from 'react';
import { DropdownOption } from '../../../interfaces/dropdown/dropdown-option';
import DropdownOpen from './dropdown-open/dropdown-open';
import './dropdown.scss';
import DropdownArrow from '../../../img/form-elements/dropdown/dropdown-arrow.png';
import DropdownClose from '../../../img/form-elements/dropdown/dropdown-close.png';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { IFormValues } from '../../modals/add-pledge/add-pledge.modal';

interface Props {
    options: Array<DropdownOption> | null;
    searchPlaceholder?: string;
    title: string,
    disabled?: boolean,
    withSearch: boolean,
    emptyPlaceholder?: string,
    selectedValue?: string | null,
    onSelect?: (option: DropdownOption) => void,
    onDeSelect?: () => void;
    register?: UseFormRegister<IFormValues>;
}

const Dropdown = ((props: Props) => {

        let { register, options, searchPlaceholder, title, disabled, withSearch, emptyPlaceholder, selectedValue, onSelect, onDeSelect } = props;

        const [open, setOpen] = useState(false);
        const [search, setSearch] = useState("");
        const [selected, setSelected] = useState<DropdownOption | null>(null);

        const emptyTitle = emptyPlaceholder ?? "No items selected";


        const searchHandler = (e: any) => {
            setSearch(e.target.value);
        }

        const selectHandler = (option: DropdownOption) => {
            if (options && options.includes(option)) {

                setSelected(option);

                setOpen(false);

                if (onSelect)
                    onSelect(option);
            }
        }

        const deselectHandler = (e: any) => {
            e.stopPropagation();

            setSelected(null);
            setOpen(false);
            if (onDeSelect)
                onDeSelect();
        }

        const openHandler = (open: boolean) => {
            if (disabled)
                return;

            setSearch("");
            setOpen(open);
        }

        if (!!search.trim() && options) {
            options = options.filter(o => {
                return o.name.toLowerCase().includes(search.toLowerCase());
            });
        }

        useEffect(() => {
            if (options && selectedValue !== undefined) {
                if (selectedValue == null)
                    setSelected(null);
                else {
                    const foundOption = options.find(o => o.value === selectedValue);
    
                    if (foundOption)
                        setSelected(foundOption);
                }
            }

            if (open) {
                window.addEventListener('click', () => setOpen(false))
            }
            else {
                window.removeEventListener('click', () => setOpen(false))
            }
        });

        return (
            <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                <div className="dropdown__title title-label">
                    <label>{title}</label>
                </div>

                <div className="dropdown__selected input-wrapper" onClick={() => openHandler(!open)}>
                    <div className="dropdown__selected-text">
                        <div className="selected-area">
                        {
                                register ? 
                                    <input
                                    className="selected-area__option"
                                    defaultValue={selected ? selected.name : ""}
                                    placeholder={emptyTitle}
                                    {...register("Target")}
                                    />
                                :
                                    <input
                                        className="selected-area__option"
                                        value={selected ? selected.name : ""}
                                        placeholder={emptyTitle}
                                        onChange={() => false}
                                    />
                            }

                            {selected ?

                                <img
                                    alt="close"
                                    className="dropdown__close-icon"
                                    src={DropdownClose}
                                    onClick={(e) => deselectHandler(e)}
                                />
                                : ""
                            }
                        </div>

                    </div>
                    <div className="dropdown__arrow">
                        <img src={DropdownArrow} alt="Arrow" className="dropdown__arrow-pic center-pic" />
                    </div>
                </div>

                {open ?
                    <DropdownOpen
                        searchPlaceholder={searchPlaceholder || ""}
                        options={options}
                        withSearch={withSearch}
                        searchHandler={searchHandler}
                        selectHandler={selectHandler}
                    />
                    :
                    ""
                }

            </div>
        );
    })

export default Dropdown;
