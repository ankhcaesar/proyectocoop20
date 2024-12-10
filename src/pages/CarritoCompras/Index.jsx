import styles from "./CarritoCompras.module.css";
import Header from "../../components/Header/Index";
import Protegido from "../../context/Protegido";
import db from "../../db/db";
import { useContext, useEffect, useState } from "react";
import Botton from "../../components/Botton/Index";
import { GlobalContext } from "../../context/GlobalContext";
import TarjetasCarrito from "../../components/TarjetasCarrito/Index";
import PopUpConfirm from "../../components/PopUpConfirm/Index";

function CarritoCompras() {
  //variables
  const { ir, idVenta, statusVenta, formatomoneda } = useContext(GlobalContext);
  const [listaProds, setListaProds] = useState([]);
  useEffect(() => {
    if (!statusVenta) {
      ir("MenuCompras");
      return;
    }

    const cargarProductos = async () => {
      try {
        if (!idVenta) return;

        // Buscar productos en lista_prods con el idVenta actual
        const productosVenta = await db.lista_prods
          .where("id_venta")
          .equals(idVenta)
          .toArray();

        if (productosVenta.length === 0) {
          setListaProds([]); // Si no hay productos, limpiar el estado
          return;
        }

        // Combinar datos de lista_prods con articulos
        const productosConDatos = await Promise.all(
          productosVenta.map(async (prod) => {
            const articulo = await db.articulos.get(prod.id_art);
            if (!articulo) return null;

            // Crear URL del Blob para la imagen
            const urlImagen = articulo.imagen_blob
              ? URL.createObjectURL(articulo.imagen_blob)
              : "";

            return {
              id_lista_prods: prod.id_lista_prods,
              id_art: prod.id_art,
              imagen: urlImagen, // Usar la URL de la imagen aquí
              nombre: articulo.nombre_art || "Desconocido",
              descripcion: articulo.descripcion_art || "Sin descripción",
              valor_unit: prod.valor_unit,
              cant: prod.cant,
              total_valor: prod.total_valor,
            };
          })
        );

        // Filtrar nulos y actualizar el estado
        setListaProds(productosConDatos.filter((item) => item !== null));



      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    cargarProductos();
  }, [idVenta, statusVenta, ir]);

  const actualizarCant = async (id_lista_prods, operacion) => {
    const producto = listaProds.find((prod) => prod.id_lista_prods === id_lista_prods);
    if (producto) {
      const nuevaCantidad = operacion === "sumar" ? producto.cant + 1 : producto.cant - 1;

      if (nuevaCantidad > 0) {
        const nuevoTotal = producto.valor_unit * nuevaCantidad;
        await db.lista_prods.update(id_lista_prods, { cant: nuevaCantidad, total_valor: nuevoTotal });
        setListaProds((prev) =>
          prev.map((p) =>
            p.id_lista_prods === id_lista_prods ? { ...p, cant: nuevaCantidad, total_valor: nuevoTotal } : p
          )
        );
      } else {
        // Eliminar el producto si la cantidad llega a 0
        await db.lista_prods.delete(id_lista_prods);
        setListaProds((prev) => prev.filter((p) => p.id_lista_prods !== id_lista_prods));
      }
    }
  };

  const totalCompra = listaProds.reduce((acc, prod) => acc + prod.total_valor, 0).toFixed(2);
  const totalProductos = listaProds.reduce((acc, prod) => acc + prod.cant, 0)
  return (
    <section className={styles.contenedorCarritoCompras}>
      <Header titulo="Carrito de compras" />
      <div className={styles.container}>
        <div className={styles.tarjetasProductos}>
          {listaProds.length > 0 ? (
            listaProds.map((prod) => (

              <TarjetasCarrito
                key={prod.id_lista_prods}
                id_art={prod.id_art}
                id_lista_prods={prod.id_lista_prods}
                urlImagen={prod.imagen}
                nombre={prod.nombre}
                descripcion={prod.descripcion}
                valor_unit={prod.valor_unit}
                cant={prod.cant}
                total_valor={formatomoneda(prod.total_valor)}
                onActualizarCant={actualizarCant}
              />
            )))
            : (
              <p className={styles.articulo}>No hay artículos disponibles</p>
            )}
        </div>
        <div className={styles.containertTotales}>
          <div className={styles.subTotales}>
            <p>Cantidad de productos: {listaProds.length}</p>
            <p>Total de unidades ({totalProductos})
            </p>
          </div>
          <div className={styles.totalCompra}>
            <p>
              TOTAL COMPRA:{formatomoneda(totalCompra)}



            </p>
          </div>
        </div>
      </div>
      <div className={styles.botones}>
        <Botton
          mane="Agregar"
          label="AGREGAR"
          type="Button"
          medida="40%"
          onClick={() => ir("AgrProductos")}
        />
        <Botton
          mane="Finalizar"
          label="TERMINAR"
          type="Button"
          medida="40%"
          onClick={() => ir("FinCompra")}
        />
      </div>
    </section>
  );
}

export default Protegido(CarritoCompras);
