import style from './Logo.module.scss'

const Logo = () => {
    return(
        <div className={style.root}>
            <img src="/images/OpenClimateLogoIcon.png" alt="logo" className={style.ocLogoIcon}/>
            <img src="/images/OpenClimateLogoText.png" alt="logo" className={style.ocLogoText}/>
        </div>
    )
}

export default Logo