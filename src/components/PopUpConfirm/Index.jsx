import { useContext } from "react";
import { GlobalContext } from '../../context/GlobalContext';
import styles from "./PopUpConfirm.module.css";
import iconoOk from "/Icons/check_blanco.svg";
import tachito from "/Icons/tachito_blanco.svg";
import db from "../../db/db";

function PopUpConfirm({onClose, data, from}) {
    const { setPopUp, idVenta, limpiarPopUp } = useContext(GlobalContext);
    const { id,  urlImagen, nombre, descripcion, valor } = data[0];

    const agregarProducto = async () => {
        try {
            // Buscar si el producto ya existe en la tabla lista_prods con el mismo id_venta e id_art
            const productoExistente = await db.lista_prods
                .where("id_venta")
                .equals(idVenta)
                .toArray();

            // Filtrar por id_art para encontrar el producto específico
            const producto = productoExistente.find(prod => prod.id_art === id);

            if (producto) {
                // Verificar si id_lista_prods está definido antes de actualizar
                if (producto.id_lista_prods !== undefined) {
                    const nuevaCant = producto.cant + 1;
                    const nuevoTotalValor = nuevaCant * producto.valor_unit;

                    // Actualizar el producto existente
                    await db.lista_prods.update(producto.id_lista_prods, {
                        cant: nuevaCant,
                        total_valor: nuevoTotalValor
                    });
                } else {
                    console.error("Error: id_lista_prods no está definido");
                }
            } else {
                // Agregar un nuevo producto si no existe
                const nuevoProducto = {
                    id_venta: idVenta,
                    id_art: id,
                    valor_unit: valor,
                    cant: 1,
                    total_valor: valor
                };

                await db.lista_prods.add(nuevoProducto);
            }

            // Mostrar mensaje de éxito en el popup
            setPopUp({
                show: true,
                message: `Producto ${nombre} agregado exitosamente!`,
                type: "ok",
                zeIndex: "98",
                from: "MSJ",
                duration: "2s"
            });

            // Cerrar el PopUp después de 2 segundos
            setTimeout(() => {
                limpiarPopUp();  // Limpiar el PopUp
                onClose();       // Cerrar el PopUp
            }, 2000);
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    };

    return (
        <>
            {from === "AGRP" && (
                <div className={styles.overlay}>
                    <div className={styles.PopUpContainer}>
                        <div className={styles.producto}>
                            <h3 className={styles.nombre}>{nombre}</h3>
                            <img className={styles.imagen} src={urlImagen} alt={`imagen de ${nombre}`} />
                            <p className={styles.descripcion}>Detalle: {descripcion}</p>
                            <p className={styles.valor}>Valor unitario: {valor}</p>
                        </div>
                        <div className={styles.botton}>
                            <button
                                className={styles.botonok}
                                type="button"
                                onClick={agregarProducto}
                            >
                                <img src={iconoOk} alt="Agregar" />
                            </button>
                            <button
                                className={styles.botoncerrar}
                                type="button"
                                onClick={onClose}
                            >
                                <img src={tachito} alt="Cancelar" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}

export default PopUpConfirm;
