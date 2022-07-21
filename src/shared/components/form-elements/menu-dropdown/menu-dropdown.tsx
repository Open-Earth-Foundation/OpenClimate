import React, { FunctionComponent, useEffect } from 'react'
import { useState } from 'react';
import { DropdownOption } from '../../../interfaces/dropdown/dropdown-option';

import { NavLink, useHistory } from 'react-router-dom';
import ArrowIcon from '../../../img/form-elements/dropdown/arrow dropdown.svg'

import { ArrowDropUp, ArrowDropDown, ArrowForwardIos} from '@mui/icons-material';
import Button from '../../form-elements/button/button';

import './menu-dropdown.scss';

interface Props {
    title?: string,
    doLogout: () => void
}

const MenuDropdown: FunctionComponent<Props> = (props) => {

    let { title, doLogout } = props;

    let history = useHistory();

    const [ open, setOpen ] = useState(false);

    const selectHandler = (option: DropdownOption) => {
    }


    const onRegisterWalletClick = () => {
        history.push('/register-wallet');
        setOpen(false);
    }

    const logoutHandler = () => {
        doLogout();
        setOpen(false);
    }

    useEffect(() => {
        window.addEventListener('hashchange', function() {
            console.log('The hash has changed!')
          }, false);
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

            <div className="dropdown-menu__icon" onClick={() => setOpen(!open)}>
                { open ? <ArrowDropUp/> : <ArrowDropDown/>}
            </div>

            { open ? 
                <div className="dropdown-menu__open dropdown-open">
                    <div className="dropdown-menu__open dropdown-menu__container" onClick={onRegisterWalletClick}>
                        <div className="dropdown-menu__wallet-text" >Register Business Wallet</div>
                        <ArrowForwardIos className="dropdown-menu__business-icon" fontSize="inherit"/>
                        
                    </div>
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
