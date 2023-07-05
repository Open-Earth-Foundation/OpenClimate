import React, { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import { IUser } from "../../../../api/models/User/IUser";
import "./nav-menu.scss";

interface Props {
  currentUser: IUser | null;
}

const NavMenu: FunctionComponent<Props> = (props) => {
  var userAdmin = false;
  const { currentUser } = props;
  if (currentUser && currentUser.roles) {
    userAdmin = currentUser.roles.indexOf("admin") > -1;
  }
  const showAccount = currentUser != null;

  return (
    <nav className="toolbar-menu">
      <ul className="toolbar-menu__list">
        <li className="toolbar-menu__item">
          <NavLink
            exact={true}
            to="/"
            className="toolbar-menu__link"
            activeClassName="toolbar-menu__link_active"
          >
            Explore
          </NavLink>
        </li>
        <li className="toolbar-menu__item">
          <a
            href="https://www.notion.so/openearth/OpenClimate-Contributor-Guide-75276fcc22ce4f47b69fec5ef4fb69c3"
            className="toolbar-menu__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </a>
        </li>
        <li className="toolbar-menu__item">
          <NavLink
              exact={true}
              to="/datacoverage"
              className="toolbar-menu__link"
              activeClassName="toolbar-menu__link_active"
            >
              Data
          </NavLink>
        </li>

        {showAccount && userAdmin ? (
          <li className="toolbar-menu__item">
            <NavLink
              to="/account"
              className="toolbar-menu__link"
              activeClassName="toolbar-menu__link_active"
            >
              Account
            </NavLink>
            <NavLink
              to="/admin"
              className="toolbar-menu__link"
              activeClassName="toolbar-menu__link_active"
            >
              Admin
            </NavLink>
          </li>
        ) : (
          ""
        )}

        {showAccount && !userAdmin ? (
          <li className="toolbar-menu__item">
            <NavLink
              to="/account"
              className="toolbar-menu__link"
              activeClassName="toolbar-menu__link_active"
            >
              Account
            </NavLink>
          </li>
        ) : (
          ""
        )}
      </ul>
    </nav>
  );
};

export default NavMenu;
