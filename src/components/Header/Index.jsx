import { useState } from "react"
import styles from "./Header.module.css"
import { Link } from "react-router-dom"

function Header(props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <section className={styles.containerheader}>
            <header>
                <div className={styles.titulo}>
                    <h2>{props.titulo}</h2>
                </div>

                <div className={styles.botones}>
                    <button className={styles.bottonMenu} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <img className={isMenuOpen ? styles.iconoMenuopen : styles.iconoMenuclose} src="./Icons/menu.svg" alt="menu" />
                    </button>
                </div>
            </header>
            <nav className={isMenuOpen ? styles.navOpen : styles.navClose}>
                <ul>
                    <li><Link to="/MenuCompras">Menu Compras</Link></li>
                    <li><Link to="/"></Link></li>
                    <li><Link to="/">Salir</Link></li>

                </ul>
            </nav>


        </section>
    )
}
export default Header