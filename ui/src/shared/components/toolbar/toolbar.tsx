import React, { FunctionComponent, useState } from 'react'
import { NavLink } from 'react-router-dom';
import MainLogoIcon from '../../img/toolbar/OpenClimate_Beta_logo.svg';
import NavMenu from './nav-menu/nav-menu';
import SearchToolbar from './toolbar-search/toolbar-search';
import ToolbarAutorized from './toolbar-authorized/toolbar-autorized';
import { IUser } from '../../../api/models/User/IUser';
import './toolbar.scss';
import {VscMenu, VscArrowRight, VscChevronRight} from 'react-icons/vsc';
import {HiUserCircle} from 'react-icons/hi';


interface Props {
    user: IUser | null,
    showLoginModal: () => void,
    handleLogout: () => void
}

const MainToolbar: FunctionComponent<Props> = (props) => {
    const [openSideNav, setOpenSideNav] = useState<boolean>(false)
    const { user, showLoginModal, handleLogout } = props;

    const sideNavHandler = () => {
        setOpenSideNav((prevNavState)=>!prevNavState)
        console.log(openSideNav)
    }

    const handleCloseSideNav = () => {
        setOpenSideNav((prevNavState)=>!prevNavState)
    }

    return (
        <React.Fragment>
            <div className="toolbar">
                <div className="toolbar__wrapper">
                <div className='toolbar__icon-menu'>
                        <button onClick={sideNavHandler} className='toolbar__button'>
                            <VscMenu className='toolbar__icon'/>
                        </button>
                    </div>
                    <div className="toolbar__logo">
                        <NavLink exact={true} to="/" className="toolbar__logo-link">
                            <img className="toolbar__logo-pic" src={MainLogoIcon} alt="Open Climate" />
                        </NavLink>
                    </div>

                    <div className="toolbar__content">
                        <NavMenu currentUser={user} />

                        <div className="toolbar__right-area">
                                {user ?
                                    <ToolbarAutorized user={user} doLogout={handleLogout} />
                                :
                                    <div className="toolbar__login">
                                        <button
                                            className="toolbar__login-btn"
                                            onClick={showLoginModal}>
                                                Log In
                                        </button>
                                    </div>
                                }
                        </div>
                    </div>
                </div>
                {
                    openSideNav && (
                        <div className='toolbar__sideNav'>
                            <div onClick={handleCloseSideNav} className='toolbar__sidenav-overlay'></div>
                            <div className='toolbar__sidenav-content'>
                                <ul className='toolbar__sidenav-menu-items'>
                                    <div className='toolbar__sidenav-logo'>
                                        <p>open<span className='toolbar__logo-bold'>climate</span><span className='toolbar__version-text'>Ver 1.0.0<span></span></span></p>
                                    </div>
                                    <li>
                                        <span>
                                            Explore
                                        </span>
                                        <VscChevronRight className='toolbar__icon-nav'/>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )
                }
            </div>


        </React.Fragment>

    );
}


export default MainToolbar;
