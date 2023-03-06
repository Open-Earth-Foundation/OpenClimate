import React, { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import "./account-menu.scss";

interface Props {}

const AccountMenu: FunctionComponent<Props> = (props) => {
  return (
    <nav className="account-menu">
      <ul className="account-menu__list">
        <li className="account-menu__item">
          <NavLink
            exact={true}
            to="/account"
            className="account-menu__link"
            activeClassName="account-menu__link_active"
          >
            Dashboard
          </NavLink>
        </li>
        <li className="account-menu__item">
          <NavLink
            to="/account/climate-actions"
            className="account-menu__link"
            activeClassName="account-menu__link_active"
          >
            Climate actions
          </NavLink>
        </li>
        <li className="account-menu__item">
          <NavLink
            to="/account/sites"
            className="account-menu__link"
            activeClassName="account-menu__link_active"
          >
            Sites
          </NavLink>
        </li>
        <li className="account-menu__item">
          <NavLink
            to="/account/pledges"
            className="account-menu__link"
            activeClassName="account-menu__link_active"
          >
            Pledges
          </NavLink>
        </li>
        <li className="account-menu__item">
          <NavLink
            to="/account/demo-widgets"
            className="account-menu__link"
            activeClassName="account-menu__link_active"
          >
            Demo Widgets
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AccountMenu;
