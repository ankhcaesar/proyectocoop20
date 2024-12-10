import { useContext } from "react";
import db from "./db";
import { GlobalContext } from "../context/GlobalContext";

// usado en PopUpConfirm
export async function agregarHistorial(idVenta) {

    try {
        if (typeof idVenta !== "number") {
            throw new Error("El ID de venta debe ser un número.");
        }
        const venta = await db.ventas.get(idVenta);

        if (!venta) {
            throw new Error("No se encontró la venta con el ID proporcionado.");
        }

        const listaProductos = await db.lista_prods.where("id_venta").equals(idVenta).toArray();
        if (listaProductos.length === 0) {
            throw new Error("No hay productos asociados a esta venta.");
        }

        const profile = await db.settings.get("profile");
        console.log("Perfil recuperado de settings:", profile);
        if (!profile || !profile.user_id) {
            throw new Error("No se encontró un perfil válido para asociar.");
        }

        if (venta.id_profile !== profile.user_id) {
            throw new Error(
                "El ID del perfil asociado en la tabla ventas no coincide con el ID del perfil en la base de datos."
            );
        }

        // Calcular el total de productos y la cantidad total
        const totalProductos = listaProductos.reduce((total, prod) => total + prod.cant, 0);
        const totalArticulos = listaProductos.length;

        // Preparar los datos para insertar en la tabla `historial`
        const nuevaEntradaHistorial = {
            fecha_venta: venta.fecha_venta,
            id_profile: profile.user_id,
            id_lista_prods: venta.id_lista_prods,
            total_valor: venta.total_valor,
            medio_pago_0: venta.medio_pago_0 || 0,
            medio_pago_1: venta.medio_pago_1 || 0,
            medio_pago_2: venta.medio_pago_2 || 0,
            estado: "terminado",
        };

        const idHistorial = await db.historial.add(nuevaEntradaHistorial);

        console.log(`Se agregó la entrada en historial con ID: ${idHistorial}`);

        return { success: true, idHistorial };
    } catch (error) {
        console.error("Error al agregar a la tabla historial:", error);
        return { success: false, error: error.message };
    }
}

// usado en PopUpConfirm despues de InresoManual e IngresoQr
export async function agregarProducto( idVenta, nombre, id, valor, setPopUp, limpiarPopUp, onClose) {

    

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

   
        setPopUp({
            show: true,
            message: `Producto ${nombre} agregado exitosamente!`,
            type: "ok",
            zeIndex: "98",
            from: "MSJ",
            duration: "2s"
        });
        setTimeout(() => {
            limpiarPopUp();  
            onClose();       
        }, 2000);
    } catch (error) {
        console.error("Error al agregar producto:", error);
    }
};