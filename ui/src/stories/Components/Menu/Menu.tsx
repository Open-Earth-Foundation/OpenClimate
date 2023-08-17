import { MdChevronRight, MdClose, MdDiversity3, MdLanguage, MdMenu, MdOutlineAccountTree, MdTravelExplore } from "react-icons/md";
import Logo from "../Logo/Logo";
import style from "./Menu.module.scss";
import { useState } from "react";

const Menu = () =>{
    const [toggleMenu, setToggleMenu] = useState<boolean>(false);

    const onToggleMenu = () => {
        return setToggleMenu((value) => !value)
    }

    console.log(toggleMenu)

    return(
        <div className={style.root}>
            <header className={style.header}>
                <div className={style.container}>
                    <div className={style.wrapper}>
                        <div className={style.menu}>
                            <img src="/images/OpenClimateLogoIcon.png" alt="logo" className={style.ocLogoIcon}/>
                            <img src="/images/OpenClimateLogoText.svg" alt="logo" className={style.ocLogoText}/>
                            <div className={style.menuIcon}>
                                {
                                    toggleMenu ?  <MdClose onClick={onToggleMenu} size={24} color="white"/> : <MdMenu onClick={onToggleMenu} size={24} color="white"/>
                                }
                            </div>
                        </div>
                        <nav className={style.nav}>
                            <a href="/">Explore</a>
                        </nav>
                    </div>
                </div>
            </header>
            {
                toggleMenu && (
                    <div className={style.sideNav}>
                        <div>
                            <a
                                href="/"
                                >
                                <div className={style.iconText}>
                                    <MdTravelExplore size={24} color="#00001f"/>
                                    <span>Explore</span>
                                </div>
                                <div className={style.rightIcon}>
                                    <MdChevronRight size={24} color="#00001f"/>
                                </div>
                            </a>
                            <a
                                href="/"
                                >
                                <div className={style.iconText}>
                                    <MdOutlineAccountTree size={24} color="#00001f"/>
                                    <span>Data Coverage</span>
                                </div>
                                <div className={style.rightIcon}>
                                    <MdChevronRight size={24} color="#00001f"/>
                                </div>
                            </a>
                            <a
                                href="/"
                                >
                                <div className={style.iconText}>
                                    <MdDiversity3 size={24} color="#00001f"/>
                                    <span>Collaborate</span>
                                </div>
                                <div className={style.rightIcon}>
                                    <MdChevronRight size={24} color="#00001f"/>
                                </div>
                            </a>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Menu;