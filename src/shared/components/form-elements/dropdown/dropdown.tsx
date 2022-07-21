import React, { ForwardedRef, forwardRef, FunctionComponent, useEffect } from 'react'
import { useState } from 'react';
import { DropdownOption } from '../../../interfaces/dropdown/dropdown-option';
import DropdownOpen from './dropdown-open/dropdown-open';
import DropdownArrow from '../../../img/form-elements/dropdown/dropdown-arrow.png';
import DropdownClose from '../../../img/form-elements/dropdown/dropdown-close.png';
import { Path, UseFormRegister, FieldError } from "react-hook-form";
import './dropdown.scss';

interface Props {
    options: Array<DropdownOption> | null;
    searchPlaceholder?: string;
    title: string,
    disabled?: boolean,
    withSearch: boolean,
    emptyPlaceholder?: string,
    selectedValue?: string | null,
    required?: boolean,
    onSelect?: (option: DropdownOption) => void,
    onDeSelect?: (error?: boolean) => void,
    label?: Path<any>,
    register?: UseFormRegister<any>,
    errors?: FieldError,
    setValue?: any
}

const Dropdown = ((props: Props) => {
    const [optionData, setData] = useState<any>([])

        
        let { register, setValue, label,  errors,
            options, required, searchPlaceholder, title, 
            disabled, withSearch, emptyPlaceholder, selectedValue, 
            onSelect, onDeSelect } = props;

            const fn = async () => {
                const d = await options
                if(d){
                    setData(d)
                }
            }
            
    
            useEffect(()=> {
                fn();
                if(optionData) {
                    console.log(true);
                }
            }, [optionData])
    


        const [open, setOpen] = useState(false);
        const [search, setSearch] = useState("");
        const [selected, setSelected] = useState<DropdownOption | null>(null);
        const [error, setError] = useState<boolean>(false);

        const emptyTitle = emptyPlaceholder ?? "No items selected";

        const searchHandler = (e: any) => {
            setSearch(e.target.value);
        } 
 
        const selectHandler = async (option: DropdownOption) => {
            console.log(option)
            const op = await option
            
            if (op) {

                setSelected(op);

                setOpen(false);

                if (onSelect)
                    onSelect(op);

                setError(false);

                if(setValue)
                    setValue(label, op.value, { shouldValidate: true });
            }
        }

        const deselectHandler = (e: any) => {
            e.stopPropagation();
            
            setSelected(null);
            setOpen(false);
            
            if(setValue)
                setValue(label, '', {shouldValidate: true});

            if(onDeSelect)
                onDeSelect();
        }

        const openHandler = (open: boolean) => {
            if (disabled)
                return;

            setSearch("");
            setOpen(open);
        }

        if (!!search.trim() && optionData) {
            options = optionData.filter((o:any) => {
                return o.name.toLowerCase().includes(search.toLowerCase());
            });
        }

        useEffect(() => {
            if (options && selectedValue !== undefined) {
                if (selectedValue == null)
                    setSelected(null);
                else {
                    const foundOption = optionData.find(o => o.value === selectedValue);

                    if (foundOption)
                    {
                        setSelected(foundOption);
                        if(setValue)
                            setValue(label, foundOption.value, { shouldValidate: true });
                        selectedValue=null;
                    }
                }
            }

            if (open) {
                window.addEventListener('click', () => setOpen(false))
            }
            else {
                window.removeEventListener('click', () => setOpen(false))
            }
        }, [optionData, selectedValue]);

        return (
            <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                <div className="dropdown__title title-label">
                    <label>{title}</label>
                </div>

                <div 
                    className={`${error ? 'field-error' : ''} dropdown__selected input-wrapper`} 
                    onClick={() => openHandler(!open)}
                >
                    <div className="dropdown__selected-text">
                        <div className="selected-area">


                            {
                                register && label ? 
                                <>
                                <input
                                    autoComplete='off'
                                    className='selected-area__option'
                                    value={selected ? selected.name : ""}
                                    placeholder={emptyTitle}
                                    {...register(label, { required })}
                                />
                                </>
                                :
                                <input
                                    autoComplete='off'                                
                                    className='selected-area__option'
                                    value={selected ? selected.name : ""}
                                    placeholder={emptyTitle}
                                    onChange={(e) =>{
                                        deselectHandler(e)
                                    }}
                                />
                            }

                            {/* {selected ?

                                <img
                                    alt="close"
                                    className="dropdown__close-icon"
                                    src={DropdownClose}
                                    onClick={(e) => }
                                />
                                : ""
                            } */}
                        </div>

                    </div>
                    <div className="dropdown__arrow">
                        <img src={DropdownArrow} alt="Arrow" className="dropdown__arrow-pic center-pic" />
                    </div>
                </div>

                {errors  && (
                                    <span role="alert">
                                    This field is required
                                    </span>
                                )}

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
