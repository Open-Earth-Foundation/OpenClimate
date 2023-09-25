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
                <a>About Open Climate</a>
              </div>
              <div className="footer__footerLinks">
                <a>Contribution Guide</a>
              </div>
              <div className="footer__footerLinks">
                <a>Go to GitHub</a>
              </div>
              <div className="footer__footerLinks">
                <a>CAD2.0 Community</a>
              </div>
              <div className="footer__footerLinks">
                <a>Read the Docs</a>
              </div>
              <div className="footer__footerLinks">
                <a>Python Client Docs</a>
              </div>
            </div>
            <div className="footer__cta">
              <button className="footer__ctaBtnA">CONTACT US</button>
              <button className="footer__ctaBtnB">DONATE NOW</button>
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
              <span className="footer__feedBackText">Send Feedback</span>
            </div>
            <div className="footer__OEFLogo">
              <img src="/poweredBy.png" alt="OEFLogo" />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default MainFooter;
