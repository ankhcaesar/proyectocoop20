import styles from "./CarritoCompras.module.css"
import Header from "../../components/Header/Index"
import Protegido from "../../context/Protegido"
import db from "../../db/db"
import { useEffect, useState } from "react"

function CarritoCompras() {

    const [arts, setArts]=useState([])

    useEffect(() => {
        const fetchArticulos = async () => {
          const data = await db.articulos.toArray();
          setArts(data);
        };
    
        fetchArticulos();
      }, []);
    

    return (
        <>
            <Header titulo="Carrito de compras" />

            <ul>
        {arts.map((art) => (
          <li key={art.id_art}>{art.nombre_art}</li>
        ))}
      </ul>

        </>
    )
}
export default Protegido(CarritoCompras)