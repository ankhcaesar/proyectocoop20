import styles from "./PopUpConfirm.module.css"
import iconoCerrar from "/Icons/nocheck.svg"
import iconoOk from "/Icons/check_blanco.svg"
import tachito from "/Icons/tachito_blanco.svg"

function PopUpConfirm({ from, urlImagen, nombre, descripcion, valor, onClose }) {

    return (
        <>
            {from === "COMP" &&
                <div className={styles.overlay}>
                    <div className={styles.PopUpContainer} >

                    </div>
                </div>
            }
            {from === "AGRP" &&
                <div className={styles.overlay} >
                    <div className={styles.PopUpContainer}>

                        <div className={styles.producto} >
                            <h3 className={styles.nombre}>{nombre}</h3>
                            <img className={styles.imagen} src={urlImagen} alt={`Imagen de ${nombre}`} />
                            <p className={styles.descripcion}>Detalle: {descripcion}</p>
                            <p className={styles.valor}>Valor unitario: ${valor}</p>

                        </div>

                        <div className={styles.botton}>
                            <button
                                className={styles.botonok}
                                name="Aceptar"
                                label=""
                                type="button"
                                
                            > <img src={iconoOk} alt="" /> </button>

                            <button
                                className={styles.botoncerrar}
                                name="Cancelar"
                                label=""
                                type="button"
                                
                                onClick={onClose}
                                > <img src={tachito} alt="" /> </button>

                        </div>
                    </div>
                </div>
            }
        </>
    )
}
export default PopUpConfirm