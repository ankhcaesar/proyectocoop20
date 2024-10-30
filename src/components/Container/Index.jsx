import styles from "./Container.module.css"

function Container({ children }) {
    return (
        <section className={styles.containerContainer}>
            {children}
        </section>
    )
}
export default Container