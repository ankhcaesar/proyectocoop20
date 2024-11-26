import styles from "./IngresoManual.module.css";
import { useEffect, useState } from "react";
import TarjetasIngresoManual from "../TarjetasIngresoManual/Index";
import db from "../../db/db";
import InputForm from "../InputForm/Index";
import ListaFiltros from "../ListaFiltros/Index";

function IngresoManual() {
    const [arts, setArts] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null);
    const [busquedaTexto, setBusquedaTexto] = useState("");

    useEffect(() => {
        const fetchFiltros = async () => {
            const categorias = await db.categorias.toArray();
            const subcategorias = await db.subcategorias.toArray();

            // Agregar la opción "Todos"
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

            // Filtrar por categoría
            if (categoriaSeleccionada !== null) {
                data = data.filter((art) => art.id_cat === categoriaSeleccionada);
            }

            // Filtrar por subcategoría
            if (subcategoriaSeleccionada !== null) {
                data = data.filter((art) => art.id_subcat === subcategoriaSeleccionada);
            }

            // Filtrar por texto
            if (busquedaTexto) {
                data = data.filter((art) =>
                    art.nombre_art.toLowerCase().includes(busquedaTexto.toLowerCase())
                );
            }

            // Convertir blobs a URLs reutilizables
            const urlsCache = {};
            const articulosConUrls = data.map((art) => {
                if (art.imagen_blob) {
                    if (!urlsCache[art.id_art]) {
                        urlsCache[art.id_art] = URL.createObjectURL(art.imagen_blob);
                    }
                    return { ...art, imagen_url: urlsCache[art.id_art] };
                }
                return { ...art, imagen_url: null };
            });

            setArts(articulosConUrls);

            // Limpiar blobs obsoletos al desmontar
            return () => {
                Object.values(urlsCache).forEach((url) => URL.revokeObjectURL(url));
            };
        };

        fetchArticulos();
    }, [categoriaSeleccionada, subcategoriaSeleccionada, busquedaTexto]);

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
                    value={busquedaTexto}
                    updatevalue={(value) => setBusquedaTexto(value)}
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
    );
}

export default IngresoManual;
