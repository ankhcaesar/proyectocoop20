import { useContext } from "react"
import styles from "./TarjetasIngresoManual.module.css"
import { GlobalContext } from "../../context/GlobalContext"


function TarjetasIngresoManual(props) {

    const { setPopUpConfirm } = useContext(GlobalContext)
    return (

        <div className={styles.contenedorArticulo}>
            <h3 className={styles.nombre}>{props.nombre}</h3>
            <img src={props.urlImagen} alt='imagen de ${props.nombre}' />
            <p className={styles.descripcion}>{props.descripcion}</p>
            <p className={styles.valor}> ${props.valor}</p>

            <button className={styles.boton}
                onClick={() => setPopUpConfirm({
                    show: true,
                    from: "AGRP",
                    urlImagen: props.urlImagen,
                    nombre: props.nombre,
                    descripcion: props.descripcion,
                    valor: props.valor,
                })}
            />
        </div>
    )
} export default TarjetasIngresoManual