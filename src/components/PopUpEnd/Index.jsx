import { useContext } from "react";
import { GlobalContext } from '../../context/GlobalContext';
import styles from "./PopUpPopUpEnd.module.css";
import iconoOk from "/Icons/check_blanco.svg";
import tachito from "/Icons/tachito_blanco.svg";
import db from "../../db/db";
import InputForm from "../InputForm/Index"
function PopUpEnd({ from, onClose, data }) {
    const { setPopUp, idVenta, limpiarPopUp } = useContext(GlobalContext);
    const { medpago0, medpago1, medpago2, totalcompra } = data

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
            {from === "CNFV" && (
                <div className={styles.overlay}>
                    <div className={styles.PopUpContainer}>
                        <div className={styles.pagos}>

                            <form action="">
                                <div className={styles.titulo}>
                                    <label>Efectivo</label>
                                    <input
                                        className={styles.inputs}
                                        name="Efectivo"
                                        placeholder=""
                                        value={medpago0}
                                        type="text"
                                        required={true}
                                    />
                                </div>

                                <div className={styles.titulo}>
                                    <label>Transferencia</label>
                                    <input
                                        className={styles.inputs}
                                        name="Transferecia"
                                        placeholder=""
                                        value={medpago1}
                                        type="text"
                                        required={true}
                                    />
                                </div>
                                <div className={styles.titulo}>
                                    <label>Cta Cte</label>
                                    <input
                                        className={styles.inputs}
                                        name="Cta Cte"
                                        placeholder=""
                                        value={medpago2}
                                        type="text"
                                        required={true}
                                    />
                                </div>

                            </form>
                            <p>{totalcompra}</p>




                        </div>



                        <div className={styles.botton}>
                            <button
                                className={styles.botonok}
                                type="button"

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

export default PopUpEnd;
