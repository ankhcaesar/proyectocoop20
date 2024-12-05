import { useContext } from "react"
import styles from "./TarjetasIngresoManual.module.css"
import { GlobalContext } from "../../context/GlobalContext"


function TarjetasIngresoManual(props) {
const {urlImagen, nombre, descripcion, valor,id}=props

    const { setPopUpConfirm } = useContext(GlobalContext)
    return (

        <div className={styles.contenedorArticulo}>
            <h3 className={styles.nombre}>{nombre}</h3>
            <img src={props.urlImagen} alt='imagen de ${nombre}' />
            <p className={styles.descripcion}>{descripcion}</p>
            <p className={styles.valor}> ${valor}</p>

            <button className={styles.boton}
                onClick={() => setPopUpConfirm({
                    show: true,
                    from: "AGRP",
                    data: 
                        [{urlImagen: urlImagen,
                        nombre: nombre,
                        descripcion: descripcion,
                        valor: valor,
                        id: id}]
                    
                })}
            />
        </div>
    )
} export default TarjetasIngresoManual