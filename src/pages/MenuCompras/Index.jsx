import styles from "./MenuCompras.module.css";
import Header from "../../components/Header/Index";
import Protegido from "../../context/Protegido";
import Botton from "../../components/Botton/Index";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import db from "../../db/db";

function MenuCompras() {
    const { ir, idVenta, setIdVenta, setStatusVenta } = useContext(GlobalContext);

    const handleNuevaCompra = async () => {
        const ventaActiva = await db.ventas.where("estado").equals("abierto").first();

        if (!ventaActiva) {
            try {
                const profile = await db.settings.get("profile");
                const userId = profile?.user_id;

                if (userId) {
                    const nuevaVenta = {
                        fecha: new Date().toISOString(),
                        id_profile: userId,
                        id_lista_prods: "",
                        total_valor: 0,
                        medio_pago_0: 0,
                        medio_pago_1: 0,
                        medio_pago_2: 0,
                        estado: "abierto",
                    };

                    const idVenta = await db.ventas.add(nuevaVenta);

                    if (typeof idVenta === "number") {
                        setIdVenta(idVenta); // Actualiza el estado de React
                        setStatusVenta(true);

                        // Almacena en localStorage
                        localStorage.setItem("idVenta", idVenta);
                        localStorage.setItem("statusVenta", "true");

                        ir("CarritoCompras");
                    } else {
                        console.error("Error: idVenta no es un número válido.", idVenta);
                    }
                } else {
                    console.error("Perfil no encontrado");
                }
            } catch (error) {
                console.error("Error al crear la venta:", error);
            }
        } else {
            await db.ventas.update(ventaActiva.id_venta, { estado: "abierto" });

            if (typeof ventaActiva.id_venta === "number") {
                setIdVenta(ventaActiva.id_venta);
                setStatusVenta(true);

                localStorage.setItem("idVenta", ventaActiva.id_venta.toString());
                localStorage.setItem("statusVenta", "true");

                ir("CarritoCompras");
            } else {
                console.error("Error: id_venta no es un número válido.", ventaActiva.id_venta);
            }
        }
    };


    return (
        <section className={styles.contenedorMenuCompras}>
            <div>
                <Header titulo="Menu de compras" />
            </div>
            <div className={styles.opciones}>
                <Botton
                    mane="NUEVA COMPRA"
                    label={!idVenta ? "NUEVA COMPRA" : "IR AL CARRITO"}
                    type="Button"
                    onClick={handleNuevaCompra}
                />
                <Botton
                    mane="Historial"
                    label="HISTORIAL"
                    type="Button"
                    onClick={() => ir("Historial")}
                />
                <Botton
                    mane="Salir"
                    label="SALIR"
                    type="Button"
                    onClick={() => ir("salir")}
                />
            </div>
        </section>
    );
}

export default Protegido(MenuCompras);
