import { useContext, useEffect, useState } from "react";
import { GlobalContext } from '../../context/GlobalContext';
import styles from "./PopUpConfirm.module.css";
import iconoOk from "/Icons/check_blanco.svg";
import tachito from "/Icons/tachito_blanco.svg";
import db from "../../db/db";
import InputForm from "../InputForm/Index"

function PopUpConfirm({ onClose, data, from }) {
  const { setPopUp, idVenta, limpiarPopUp } = useContext(GlobalContext);
  const { id, urlImagen, nombre, descripcion, valor, medpago0, medpago1, medpago2, totalcompra } = data[0];


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

  
  const [transferencia, setTransferencia] = useState(medpago1 || "");
  const [ctaCte, setCtaCte] = useState(medpago2 || "");

  const efectivo = totalcompra - transferencia - ctaCte;

  const manejarconfirmacion = async () => {
    if (efectivo < 0) return;

    try {
      await db.ventas.update(idVenta, {
        medpago0: efectivo,
        medpago1: transferencia,
        medpago2: ctaCte,
      });
      setPopUp({
        show: true,
        message: "Venta actualizada exitosamente",
        type: "ok",
        zeIndex: "98",
        from: "MSJ",
        duration: "2s",
      });
      setTimeout(() => {
        limpiarPopUp();
        onClose();
      }, "2000");
    } catch (error) {
      console.error("Error al actualizar la venta:", error);
    }
  };

  const sumaValida = efectivo >= 0 && efectivo <= totalcompra;

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
                name="Cancelar"
                type="button"
                onClick={onClose}
              >
                <img src={tachito} alt="Cancelar" />
              </button>
            </div>
          </div>
        </div>
      )}

      {from === "CNFV" && (
        <div className={styles.overlay}>
          <div className={styles.PopUpContainerch}>

            <div className={styles.pagos}>
              <form className={styles.form}>

                <div className={styles.titulo}>
                  <label>Efectivo</label>
                  <InputForm
                    name="Efectivo"
                    value={efectivo.toFixed(2)}
                    type="number"
                    readonly={"readonly"}
                    medida="100px"

                  />
                </div>

                <div className={styles.titulo}>
                  <label>Transferencia</label>
                  <InputForm
                    name="Transferencia"
                    value={transferencia}
                    updatevalue={setTransferencia}
                    type="number"
                    medida="100px"
                  />
                </div>

                <div className={styles.titulo}>
                  <label>Cta Cte</label>
                  <InputForm
                    name="CtaCte"
                    value={ctaCte}
                    updatevalue={setCtaCte}
                    type="number"
                    medida="100px"
                  />
                </div>

              </form>
              <p className={styles.totalcompra}>Total: $ {totalcompra}</p>
            </div>

            <div className={styles.botton}>
              <button
                className={styles.botonok}
                type="button"
                onClick={manejarconfirmacion}
                disabled={!sumaValida}
              >
                <img src={iconoOk} alt="Confirmar" />
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
