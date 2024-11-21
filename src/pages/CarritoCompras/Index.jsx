import styles from "./CarritoCompras.module.css"
import Header from "../../components/Header/Index"
import Protegido from "../../context/Protegido"
import db from "../../db/db"
import { useContext, useEffect, useState } from "react"
import Botton from "../../components/Botton/Index"
import { GlobalContext } from "../../context/GlobalContext"

function CarritoCompras() {

  const { ir } = useContext(GlobalContext)

  const [arts, setArts] = useState([])

  useEffect(() => {
    const fetchArticulos = async () => {
      const data = await db.articulos.toArray();
      const articulosConUrls = data.map((art) => {
        const url = art.imagen_blob ? URL.createObjectURL(art.imagen_blob) : null;
        return { ...art, imagen_url: url };
      });
      setArts(articulosConUrls);
    };
    fetchArticulos();
    
    return () => {
      arts.forEach((art) => {
        if (art.imagen_url) URL.revokeObjectURL(art.imagen_url);
      });
    };
  }, []);

  return (
    <section className={styles.contenedorCarritoCompras}>
      <Header titulo="Carrito de compras" />
      <div className={styles.container}>
        <div className={styles.tarjetasProductos}>

          <ul className={styles.listaArticulos}>
            {arts.length > 0 ? (
              arts.map((art) => (
                <li key={art.id_art} className={styles.articulo}>
                  <div>
                    <h3>{art.nombre_art}</h3>
                    <p>{art.descripcion_art}</p>
                    {art.imagen_url ? (
                      <img
                        src={art.imagen_url}
                        alt={art.nombre_art}
                        className={styles.imagArticulo}
                      />
                    ) : (
                      <p>Imagen no disponible</p>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className={styles.articulo}>No hay artículos disponibles</li>
            )}
          </ul>
        </div>
        <div className={styles.containertTotales}>
          <div className={styles.subTotales}>
            <div><p>Cant productos: 0</p></div>
            <div><p>Total unidades: 0</p></div>
          </div>
          <div className={styles.totalCompra}><p>TOTAL COMPRA: $0.00,00</p></div>
        </div>



      </div>
      <div className={styles.botones}>
        <Botton mane="Agregar"
          label="AGREGAR"
          type="Button"
          medida="40%"
          onClick={() => ir("")}
        />
        <Botton mane="Finalizar"
          label="FINALIZAR"
          type="Button"
          medida="40%"
          onClick={() => ir("")}
        />
      </div>
    </section>
  )
}
export default Protegido(CarritoCompras)