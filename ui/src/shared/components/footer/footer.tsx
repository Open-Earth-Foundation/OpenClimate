import React, { FunctionComponent } from "react";
import "./footer.scss";
import FooterLogo from "./OEF_logo_footer_small.svg";
import BetaCapsule from "./beta_capsule.svg";

const MainFooter: FunctionComponent<{}> = (props) => {
  return (
    <React.Fragment>
      <div className="footer">
        <div className="footer__container">
          <div className="footer__content">
            <div className="foonter__OCLogoContainer">
              <img
                className="footer_ocLogo"
                src="/vector.png"
                alt="OpenClimate Logo Footer"
              />
            </div>
            <div className="footer__quickAccessLinks">
              <div className="footer__footerLinks">
                <a href="https://www.openearth.org/projects/openclimate" target="_blank" rel="noopener noreferrer">About Open Climate</a>
              </div>
              <div className="footer__footerLinks">
                <a href="https://github.com/Open-Earth-Foundation/OpenClimate/blob/develop/CONTRIBUTING_DATA.md" target="_blank" rel="noopener noreferrer">Contribution Guide</a>
              </div>
              <div className="footer__footerLinks">
                <a href="https://github.com/Open-Earth-Foundation/OpenClimate" target="_blank" rel="noopener noreferrer">Go to GitHub</a>
              </div>
              <div className="footer__footerLinks">
                <a href="https://cadalog.webflow.io/" target="_blank" rel="noopener noreferrer">CAD2.0 Community</a>
              </div>
              <div className="footer__footerLinks">
                <a href="https://github.com/Open-Earth-Foundation/OpenClimate/blob/develop/api/API.md" target="_blank" rel="noopener noreferrer">Read the Docs</a>
              </div>
              <div className="footer__footerLinks">
                <a href="https://openclimate-pyclient.readthedocs.io/en/latest/index.html" target="_blank" rel="noopener noreferrer">Python Client Docs</a>
              </div>
            </div>
            <div className="footer__cta">
              <a href="mailto:openclimate@openearth.org?subject=Contact%20From%20-%20OpenClimate" className="footer__ctaBtnA" target="_blank" rel="noopener noreferrer">CONTACT US</a>
              <a href="https://www.openearth.org/donations" className="footer__ctaBtnB">DONATE NOW</a>
            </div>
          </div>
          <hr className="footer__hr" />
          <div className="footer__content2">
            <div className="footer__versionInfo">
              <span className="footer__betaBadge">BETA</span>
              <span className="footer__versionText">
                This site is a beta version, we appreciate all feedback to
                improve the platform
              </span>
              <span className="footer__feedBackText">
                <a href="mailto:openclimate@openearth.org?subject=Feedback%20for%20OpenClimate">
                  Send Feedback
                </a>
              </span>
            </div>
            <div className="footer__OEFLogo">
              <a href="https://www.openearth.org/" target="_blank" rel="noopener noreferrer">
                <img src="/poweredBy.png" alt="OEFLogo" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default MainFooter;
