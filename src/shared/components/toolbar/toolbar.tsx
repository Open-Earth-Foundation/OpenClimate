import React, { FunctionComponent, useState } from 'react'
import MainLogoIcon from '../../img/toolbar/main-logo.png';
import NavMenu from './nav-menu/nav-menu';
import SearchToolbar from './toolbar-search/toolbar-search';
import ToolbarAutorized from './toolbar-authorized/toolbar-autorized';
import { IUser } from '../../../api/models/User/IUser';
import './toolbar.scss';

interface Props {
    user: IUser | null,
    showLoginModal: () => void,
    handleLogout: () => void
}

const MainToolbar: FunctionComponent<Props> = (props) => {

    const { user, showLoginModal, handleLogout } = props;

    return (
        <React.Fragment>
            <div className="toolbar">
                <div className="toolbar__wrapper">
                    <div className="toolbar__logo">
                        <a href="/" className="toolbar__logo-link">
                            <img className="toolbar__logo-pic" src={MainLogoIcon} alt="Open Climate" />
                        </a>
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
            </div>

            
        </React.Fragment>
 
    );
}


export default MainToolbar;
