import styles from "./IngresoManual.module.css"
import { useEffect, useState } from "react"
import TarjetasIngresoManual from "../TarjetasIngresoManual/Index";
import db from "../../db/db"
import InputForm from "../InputForm/Index"
import ListaFiltros from "../ListaFiltros/Index"

function IngresoManual() {


    const [arts, setArts] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null);




    useEffect(() => {
        const fetchFiltros = async () => {
            const categorias = await db.categorias.toArray();
            const subcategorias = await db.subcategorias.toArray();

            setCategorias([{ id_cat: null, nombre_cat: "Todos" }, ...categorias]);
            setSubcategorias([
                { id_subcat: null, nombre_subcat: "Todos", id_cat: null },
                ...subcategorias,
            ]);
        };
        fetchFiltros();
    }, []);





    useEffect(() => {
        const fetchArticulos = async () => {
            let data = await db.articulos.toArray();
            if (categoriaSeleccionada !== null) {
                data = data.filter((art) => art.id_cat === categoriaSeleccionada);
            }
            if (subcategoriaSeleccionada !== null) {
                data = data.filter((art) => art.id_subcat === subcategoriaSeleccionada);
            }
            const articulosConUrls = data.map((art) => {
                const url = art.imagen_blob
                    ? URL.createObjectURL(art.imagen_blob)
                    : null;
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
    }, [categoriaSeleccionada, subcategoriaSeleccionada]);
    
    const subcategoriasFiltradas = categoriaSeleccionada
        ? subcategorias.filter(
            (sub) => sub.id_cat === categoriaSeleccionada || sub.id_cat === null
        )
        : subcategorias;


    return (

        <section className={styles.container}>
            <div className={styles.buscador}>
                <InputForm
                    placeholder="nombre del producto"
                    type="search"
                />
            </div>
            <div className={styles.filtros}>
                <ListaFiltros
                    items={categorias}
                    selectedItem={categoriaSeleccionada}
                    onSelect={setCategoriaSeleccionada}
                    labelKey="nombre_cat"
                    idKey="id_cat"
                />
                <ListaFiltros
                    items={subcategoriasFiltradas}
                    selectedItem={subcategoriaSeleccionada}
                    onSelect={setSubcategoriaSeleccionada}
                    labelKey="nombre_subcat"
                    idKey="id_subcat"
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