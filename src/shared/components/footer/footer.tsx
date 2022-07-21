import React, { FunctionComponent } from 'react'
import './footer.scss';

const MainFooter: FunctionComponent<{}> = (props) => {
    return (
        <React.Fragment>
            <div className='footer'>

                <div className='footer__disclaimer'>
                    <span className='footer__beta'>
                        BETA
                    </span>
                    <span className='footer__disclaimer__text'>
                        This site is a beta platform, we appreciate all feedback to improve the platform
                        <a className='footer__feedback' href='mailto:ux@openearth.org'>Send feedback</a>
                    </span>
                </div>

                <div className='footer__poweredby'>
                    powered by <span className='footer__poweredby__logo'>OpenEarth</span>
                </div>

                <div className='footer__menu'>
                    <ul className='footer__menu__links'>
                        <li className='footer__menu__link'>
                            <a href='https://github.com/Open-Earth-Foundation/OpenClimate'>Go to GitHub</a>
                        </li>
                        <li className='footer__menu__link'>
                            <a href='https://wiki.climatedata.network/'>CAD 2.0 Community</a>
                        </li>
                        <li className='footer__menu__link'>
                            <a href='https://www.openearth.org/projects/openclimate'>About OpenClimate</a>
                        </li>
                    </ul>
                </div>

                <div className='footer__contactus'>
                    <a href='mailto:info@openearth.org'>Contact us</a>
                </div>

            </div>
        </React.Fragment>
    )
}

export default MainFooter;