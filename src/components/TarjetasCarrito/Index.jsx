import styles from "./TarjetasCarrito.module.css"
import iconomenos from "/Icons/menos.svg"
import iconomas from "/Icons/mas.svg"

function TarjetasCarrito(props) {
    return (
        <section className={styles.contenedorArticulo}>

            <div className={styles.izquierda}>
                <img src={props.urlImagen} alt='imagen de ${props.nombre}' /> 
            </div>

            <div className={styles.derecha}>
                <div className={styles.detallesArticulo}>
                    <h2 className={styles.nombre}>{props.nombre}</h2>
                    <p className={styles.descripcion}>{props.descripcion}</p>
                </div>
                
                <section className={styles.intecactivo}>
                    <div className={styles.comando}>
                        <button className={styles.botonmm}>
                            <img src={iconomenos} alt="menos" />
                        </button>
                        <p className={styles.cantidad}>10</p>
                        <button className={styles.botonmm}><img src={iconomas} alt="mas" /></button>
                    </div>
                    <div><p className={styles.info}>$00.000,0</p></div>
                </section>
            </div>
        </section>
    )
} export default TarjetasCarrito