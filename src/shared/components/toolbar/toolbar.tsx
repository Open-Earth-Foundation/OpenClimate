import React, { FunctionComponent, useState } from 'react'
import './toolbar.scss';
import MainLogoIcon from '../../img/toolbar/main-logo.png';
import NavMenu from './nav-menu/nav-menu';
import SearchToolbar from './toolbar-search/toolbar-search';
import ToolbarAutorized from './toolbar-authorized/toolbar-autorized';
import { IUser } from '../../../api/models/User/IUser';

interface Props {
    user: IUser | null,
    doLogout: () => void,
    showLoginModal: () => void
}

const MainToolbar: FunctionComponent<Props> = (props) => {

    const { user, doLogout, showLoginModal } = props;

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
                            <SearchToolbar />
                                {user ?
                                    <ToolbarAutorized user={user} doLogout={doLogout} />
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
