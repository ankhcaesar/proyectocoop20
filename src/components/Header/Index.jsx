import Menu from "../Menu/Index"
import styles from "./Header.module.css"

function Header(props) {



    return (
        <section className={styles.containerheader}>
            <header>
                <div className={styles.titulo}>
                    <h2>{props.titulo}</h2>
                </div>
                <Menu/>
                
            </header>

        </section>
    )
}
export default Header