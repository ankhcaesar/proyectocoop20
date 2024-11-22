import styles from "./IngresoManual.module.css"
import { useEffect, useState } from "react"
import TarjetasIngresoManual from "../TarjetasIngresoManual/TarjetasIngresoManual";
import db from "../../db/db"
import InputForm from "../InputForm/Index"

function IngresoManual() {


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
        <section className={styles.container}>
            <div className={styles.buscador}>
                <InputForm 
                placeholder="nombre del producto"
                type= "search"
                />
            </div>
            <div className={styles.tarjetasProductos}>
                {arts.length > 0 ? (
                    arts.map((art) => (
                        <TarjetasIngresoManual
                            key={art.id_art}
                            urlImagen={art.imagen_url}
                            nombre={art.nombre_art}
                            descripcion={art.descripcion_art}
                            valor={art.valor_unit}
                        />
                    ))
                ) : (
                    <p className={styles.articulo}>No hay artículos disponibles</p>
                )}

            </div>

        </section>
    )
} export default IngresoManual