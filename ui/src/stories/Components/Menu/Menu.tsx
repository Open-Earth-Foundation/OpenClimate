import style from "./Menu.module.scss";

const Menu = () =>{
    const active = true;
    return(
        <div className={style.root}>
            <ul>
                <li>
                    <a>Explore</a>
                </li>
                <li>
                    <a
                        className={`
                            ${active ? style.active: ""}
                        `}
                    >Data Coverage</a>
                </li>
            </ul>
        </div>
    )
}

export default Menu;