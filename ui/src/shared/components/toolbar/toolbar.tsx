import React, { FunctionComponent, useState } from "react";
import { NavLink } from "react-router-dom";
import OCGLOBELOGO from "../../img/toolbar/oc_globe_logo.svg";
import OCTEXTLOGO from "../../img/toolbar/oc_logo.svg";
import NavMenu from "./nav-menu/nav-menu";
import ToolbarAuthorized from "./toolbar-authorized/toolbar-authorized";
import { IUser } from "../../../api/models/User/IUser";
import "./toolbar.scss";
import { VscMenu, VscChevronRight } from "react-icons/vsc";
import SearchBar from "../../../components/search-bar/search-bar";
import {
  MdChevronRight,
  MdDiversity3,
  MdOutlineAccountTree,
  MdTravelExplore,
} from "react-icons/md";

interface Props {
  user: IUser | null;
  showLoginModal: () => void;
  handleLogout: () => void;
}

const MainToolbar: FunctionComponent<Props> = (props) => {
  const [openSideNav, setOpenSideNav] = useState<boolean>(false);
  const { user, showLoginModal, handleLogout } = props;

  const sideNavHandler = () => {
    setOpenSideNav((prevNavState) => !prevNavState);
    console.log(openSideNav);
  };

  const handleCloseSideNav = () => {
    setOpenSideNav((prevNavState) => !prevNavState);
  };

  return (
    <React.Fragment>
      <div className="toolbar">
        <div className="toolbar__wrapper">
          <div className="toolbar__menu">
            <NavLink exact={true} to="/" className="toolbar__logo-link">
              <img
                className="toolbar__logo-globe"
                src={OCGLOBELOGO}
                alt="Open Climate"
              />
            </NavLink>
            <NavLink exact={true} to="/" className="toolbar__logo-link">
              <img
                className="toolbar__logo-text"
                src={OCTEXTLOGO}
                alt="Open Climate"
              />
            </NavLink>
            <div className="toolbar__icon-menu">
              <button onClick={sideNavHandler} className="toolbar__button">
                <VscMenu className="toolbar__icon" />
              </button>
            </div>
          </div>

          <div className="toolbar__content">
            <NavMenu currentUser={user} />

            <div className="toolbar__right-area">
              <div className={"toolbar__search-bar"}>
                <SearchBar />
              </div>
              {user ? (
                <ToolbarAuthorized user={user} doLogout={handleLogout} />
              ) : (
                <div className="toolbar__login" hidden>
                  <button
                    className="toolbar__login-btn"
                    onClick={showLoginModal}>
                    Log In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {openSideNav && (
          <div className="toolbar__sideNav">
            <div>
              <a href="/">
                <div className="toolbar__iconText">
                  <MdTravelExplore size={24} color="#00001f" />
                  <span>Explore</span>
                </div>
                <div className="toolbar__rightIcon">
                  <MdChevronRight size={24} color="#00001f" />
                </div>
              </a>
              <a href="/datacoverage">
                <div className="toolbar__iconText">
                  <MdOutlineAccountTree size={24} color="#00001f" />
                  <span>Data Coverage</span>
                </div>
                <div className="toolbar__rightIcon">
                  <MdChevronRight size={24} color="#00001f" />
                </div>
              </a>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSfL2_FpZZr_SfT0eFs_v4T5BsZnrNBbQ4pkbZ51JhJBCcud6A/viewform?pli=1&pli=1">
                <div className="toolbar__iconText">
                  <MdDiversity3 size={24} color="#00001f" />
                  <span>Collaborate</span>
                </div>
                <div className="toolbar__rightIcon">
                  <MdChevronRight size={24} color="#00001f" />
                </div>
              </a>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default MainToolbar;
