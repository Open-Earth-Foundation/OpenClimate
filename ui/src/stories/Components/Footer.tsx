import { FC } from "react";
import style from "./Footer.module.scss"


const Footer:FC = () => {
    return(
        <div className={style.root}>
           <div className={style.container}>
                <div className={style.content}>
                    <div className={style.ocLogoContainer}>
                        <img className={style.ocLogo} src="/images/OpenClimateLogoText.svg" alt="OpenClimate Logo Footer"/>
                    </div>
                    <div className={style.quickAccessLinks}>
                        <div className={style.footerLinks}>
                            <a>About Open Climate</a>
                        </div>
                        <div className={style.footerLinks}>
                            <a>Contribution Guide</a>
                        </div>
                        <div className={style.footerLinks}>
                            <a>Go to GitHub</a>
                        </div>
                        <div className={style.footerLinks}>
                            <a>CAD2.0 Community</a>
                        </div>
                        <div className={style.footerLinks}>
                            <a>Read the Docs</a>
                        </div>
                        <div className={style.footerLinks}>
                            <a>Python Client Docs</a>
                        </div>
                    </div>
                    <div className={style.cta}>
                        <button className={style.ctaBtnA}>
                            CONTACT US
                        </button>
                        <button className={style.ctaBtnB}>
                            DONATE NOW
                        </button>
                    </div>
                </div>
                <hr className={style.hr}/>
                <div className={style.content2}>
                    <div className={style.versionInfo}>
                        <span className={style.betaBadge}>BETA</span>
                        <span className={style.versionText}>This site is a beta version, we appreciate all feedback to improve the platform</span>
                        <span className={style.feedBackText}>Send Feedback</span>
                    </div>
                    <div className={style.OEFLogo}>
                        <img src="/images/poweredBy.svg" alt="OEFLogo"/>
                    </div>
                </div>
           </div>
        </div>
    )
}

export default Footer;