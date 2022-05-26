import React, { FunctionComponent, useEffect } from 'react'
import { useState } from 'react';
import { DropdownOption } from '../../../interfaces/dropdown/dropdown-option';
import DropdownArrow from '../../../img/form-elements/dropdown/dropdown-arrow.png';
import DropdownClose from '../../../img/form-elements/dropdown/dropdown-close.png';
import DropdownItem from '../dropdown/dropdown-item/dropdown-item';
import ArrowIcon from '../../../img/form-elements/dropdown/arrow dropdown.svg'
import Button from '../../form-elements/button/button';

import './menu-dropdown.scss';

interface Props {
    title?: string,
    doLogout: () => void
}

const MenuDropdown: FunctionComponent<Props> = (props) => {

    let { title, doLogout } = props;

    const [ open, setOpen ] = useState(false);

    const selectHandler = (option: DropdownOption) => {
    }

    const logoutHandler = () => {
        doLogout();
        setOpen(false);
    }

    useEffect(() => {
        if(open){
            window.addEventListener('click', () => setOpen(false))
          }
          else{
            window.removeEventListener('click', () => setOpen(false))
          }
      });

    return (
        <div className="dropdown-menu"  onClick={(e) => e.stopPropagation()}>
            <div className="dropdown-menu__title" onClick={() => setOpen(!open)}>
                <label>{title}</label>
            </div>

            <div className="dropdown-menu_btn" onClick={() => setOpen(!open)}>
                <img src={ArrowIcon} alt="open" />
            </div>

            { open ? 
                <div className="dropdown-menu__open dropdown-open">
                    <div className="dropdown-menu__logout">
                        <Button 
                            color="white"
                            text="Log Out"
                            type="button"
                            click={logoutHandler}
                        />
                    </div>

                </div>
                :
                ""
            }

        </div>
    );
}


export default MenuDropdown;
