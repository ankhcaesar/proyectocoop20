import { useContext, useEffect, useState } from "react";
import { GlobalContext } from '../../context/GlobalContext';
import styles from "./PopUpConfirm.module.css";
import iconoOk from "/Icons/check_blanco.svg";
import tachito from "/Icons/tachito_blanco.svg";
import db from "../../db/db";
import InputForm from "../InputForm/Index"
import { agregarHistorial, agregarProducto } from "../../db/indexedhooks"
function PopUpConfirm({ onClose, data, from }) {
  const {
    ir,
    setPopUp, limpiarPopUp,
    idVenta, setIdVenta, setStatusVenta
  } = useContext(GlobalContext);
  const { id, urlImagen, nombre, descripcion, valor, medio_pago_0, medio_pago_1, medio_pago_2, totalcompra } = data[0];

  const [transferencia, setTransferencia] = useState(medio_pago_1 || 0);
  const [ctaCte, setCtaCte] = useState(medio_pago_2 || 0);

  const efectivo = totalcompra - transferencia - ctaCte;

  const manejarconfirmacion = async () => {
    if (efectivo < 0) return;

    try {
      await db.ventas.update(idVenta, {
        medio_pago_0: efectivo,
        medio_pago_1: parseInt (transferencia) || 0,
        medio_pago_2: parseInt(ctaCte) || 0,
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
      ir("MenuCompras")
    } catch (error) {
      console.error("Error al actualizar la venta:", error);
    }
  };

  const sumaValida = efectivo >= 0 && efectivo <= totalcompra;


  const manejarTerminarCompra = async () => {
    try {
      // Llamar a la función para agregar a historial
      const resultadoHistorial = await agregarHistorial(idVenta);

      if (!resultadoHistorial.success) {
        setPopUp({
          show: true,
          message: "Error al cerrar la venta. Inténtelo nuevamente.",
          type: "error",
          zeIndex: "98",
          duration: "3s",
        });
        return;
      }

      // Verificar que los datos están en historial
      const historialVerificado = await db.historial.get(resultadoHistorial.idHistorial);

      if (!historialVerificado) {
        throw new Error("No se pudo verificar la entrada en historial.");
      }


      await db.ventas.delete(idVenta);

      setIdVenta(null);
      setStatusVenta(false);

      setPopUp({
        show: true,
        message: "Compra finalizada exitosamente.",
        type: "ok",
        zeIndex: "98",
        duration: "2s",
      });
      setTimeout(() => {
        limpiarPopUp();
      }, 2000);

      // Recuperar datos para WhatsApp
      const profile = await db.settings.get("profile");
      const listaProductos = await db.lista_prods.where("id_venta").equals(idVenta).toArray();

      const mensajeWhatsApp = generarMensajeWhatsApp({
        fecha: historialVerificado.fecha_venta,
        nombreCliente: profile.nombre,
        idVenta,
        mediosPago: [
          historialVerificado.medio_pago_0,
          historialVerificado.medio_pago_1,
          historialVerificado.medio_pago_2,
        ],
        totalCompra: historialVerificado.total_valor,
        totalProductos: listaProductos.reduce((sum, prod) => sum + prod.cant, 0),
        totalArticulos: listaProductos.length,
        detalleProductos: listaProductos,
      });

      // Abrir enlace de WhatsApp
      window.open(`https://wa.me/${profile.user_id}?text=${encodeURIComponent(mensajeWhatsApp)}`, "_blank");
    } catch (error) {
      console.error("Error en el flujo de cierre de compra:", error);
      setPopUp({
        show: true,
        message: "Ocurrió un error al cerrar la venta.",
        type: "error",
        zeIndex: "98",
        duration: "2s",
      });
      setTimeout(() => {
        limpiarPopUp();
      }, 2000);
    }
  };

  // Generar mensaje para WhatsApp
  function generarMensajeWhatsApp({ fecha, nombreCliente, idVenta, mediosPago, totalCompra, totalProductos, totalArticulos, detalleProductos }) {
    let mensaje = `¡Hola! Detalles de la compra:\n\n`;
    mensaje += `Fecha: ${fecha}\n`;
    mensaje += `Cliente: ${nombreCliente}\n`;
    mensaje += `ID de Venta: ${idVenta}\n`;
    mensaje += `Medios de Pago: \n`;
    mensaje += `  - Efectivo: $${mediosPago[0] || 0}\n`;
    mensaje += `  - Transferencia: $${mediosPago[1] || 0}\n`;
    mensaje += `  - Cta. Cte.: $${mediosPago[2] || 0}\n`;
    mensaje += `Total Compra: $${totalCompra}\n`;
    mensaje += `Total Productos: ${totalProductos}\n`;
    mensaje += `Total Artículos: ${totalArticulos}\n\n`;
    mensaje += `Detalle de Productos:\n`;

    detalleProductos.forEach((prod, index) => {
      mensaje += `  ${index + 1}. ${prod.nombre_art} - ${prod.cant} x $${prod.valor_unit} = $${prod.total_valor}\n`;
    });

    return mensaje;
  }



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
                onClick={() => agregarProducto(
                  idVenta, nombre, id, valor, setPopUp, limpiarPopUp, onClose)}
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

      {from === "TERM" && (
        <div className={styles.overlay}>
          <div className={styles.PopUpContainerch}>

            <div className={styles.pagos}>
              <h2>Cierre de la compra</h2>
              <p>Cliente: {nombre}</p>


              <p>Cantidad de productos: </p>
              <p>Cantidad de articulos: </p>
              <p>Efectivo: {efectivo}</p>
              <p>Transferencia: {transferencia}</p>
              <p>Cta cte: {ctaCte}</p>
              <p className={styles.totalcompra}>TOTAL: $ {totalcompra}</p>
            </div>

            <div className={styles.botton}>
              <button
                className={styles.botonok}
                name="Terminarcompra"
                type="button"
                onClick={manejarTerminarCompra}
              >
                <img src={iconoOk} alt="Terminar Compra" />
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