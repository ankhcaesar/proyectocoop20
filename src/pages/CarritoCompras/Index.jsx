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
      setArts(data);
    };

    fetchArticulos();
  }, []);


  return (
    <section className={styles.contenedorCarritoCompras}>
      <Header titulo="Carrito de compras" />
      <div className={styles.container}>
        <div className={styles.tarjetasProductos}>
          <ul>
            {arts.map((art) => (
              <li key={art.id_art}>{art.nombre_art}</li>
            ))}
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