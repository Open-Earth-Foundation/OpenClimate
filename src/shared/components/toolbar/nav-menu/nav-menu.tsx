import React, { FunctionComponent } from 'react'
import { NavLink } from 'react-router-dom';
import { IUser } from '../../../../api/models/User/IUser';
import './nav-menu.scss';

interface Props {
    currentUser: IUser | null
}

const NavMenu: FunctionComponent<Props> = (props) => {
    var userAdmin = false
    const {currentUser} = props;
    if (currentUser && currentUser.roles){
        userAdmin = (currentUser.roles.indexOf("admin") > -1);
    }
    console.log('currentUser', currentUser, userAdmin)
    const showAccount = currentUser != null;

    return (
        <nav className="toolbar-menu">
            <ul className="toolbar-menu__list">
<<<<<<< HEAD
                <li className="toolbar-menu__item">
                    <NavLink exact={true} to="/" className="toolbar-menu__link" activeClassName="toolbar-menu__link_active">Explore</NavLink>
                </li>
                {showAccount ?
=======
                {showAccount && userAdmin?
>>>>>>> e633c38d4ef65536a43e005f45f84795f11085c8
                <li className="toolbar-menu__item">
                    <NavLink to="/account" className="toolbar-menu__link" activeClassName="toolbar-menu__link_active">Account</NavLink>
                    <NavLink to="/admin" className="toolbar-menu__link" activeClassName="toolbar-menu__link_active">Admin</NavLink>
                </li>
                : ""
                }
<<<<<<< HEAD
                
=======
                {showAccount && !userAdmin?
                    <li className="toolbar-menu__item">
                    <NavLink to="/account" className="toolbar-menu__link" activeClassName="toolbar-menu__link_active">Account</NavLink>
                    </li>
                : ""
                }
                <li className="toolbar-menu__item">
                    <NavLink exact={true} to="/" className="toolbar-menu__link" activeClassName="toolbar-menu__link_active">Explore</NavLink>
                </li>
>>>>>>> e633c38d4ef65536a43e005f45f84795f11085c8
            </ul>
        </nav>
    );
}


export default NavMenu;
