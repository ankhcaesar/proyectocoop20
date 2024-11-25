import styles from "./TarjetasIngresoManual.module.css"


function TarjetasIngresoManual(props) {
    return (
        <section>

            <button className={styles.superior}>
                <div className={styles.contenedorArticulo}>
                    <h3 className={styles.nombre}>{props.nombre}</h3>
                    <img src={props.urlImagen} alt='imagen de ${props.nombre}' />
                    <p className={styles.descripcion}>{props.descripcion}</p>
                    <p className={styles.valor}> ${props.valor}</p>
                </div>
            </button>

        </section>
    )
} export default TarjetasIngresoManual