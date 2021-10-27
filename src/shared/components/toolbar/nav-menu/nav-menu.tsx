import React, { FunctionComponent } from 'react'
import { NavLink } from 'react-router-dom';
import { IUser } from '../../../../api/models/User/IUser';
import './nav-menu.scss';

interface Props {
    currentUser: IUser | null
}

const NavMenu: FunctionComponent<Props> = (props) => {

    const {currentUser} = props;

    const showAccount = currentUser != null;

    return (
        <nav className="toolbar-menu">
            <ul className="toolbar-menu__list">
                {showAccount ?
                <li className="toolbar-menu__item">
                    <NavLink to="/account" className="toolbar-menu__link" activeClassName="toolbar-menu__link_active">Account</NavLink>
                </li>
                : ""
                }
                <li className="toolbar-menu__item">
                    <NavLink exact={true} to="/" className="toolbar-menu__link" activeClassName="toolbar-menu__link_active">Review</NavLink>
                </li>
                <li className="toolbar-menu__item">
                    <NavLink to="/learn" className="toolbar-menu__link" activeClassName="toolbar-menu__link_active">Learn</NavLink>
                </li>
            </ul>
        </nav>
    );
}


export default NavMenu;
