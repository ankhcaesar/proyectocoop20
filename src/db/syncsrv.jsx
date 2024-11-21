import db from "./db";
import { supabase } from "./supabaseClient";

export const syncToSupabase = async (userId) => {
    try {
        const historialOffline = await db.historial.toArray();

        if (historialOffline.length > 0) {
            const { error } = await supabase.from("historial").upsert(historialOffline);
            if (error) throw error;

            // Limpia los datos sincronizados de IndexedDB
            await db.historial.clear();
        }
    } catch (error) {
        console.error("Error sincronizando con Supabase:", error);
    }
};

export const syncFromSupabase = async () => {
    try {
        const tablas = ["articulos", "categorias", "subcategorias"];
        for (const tabla of tablas) {
            const { data, error } = await supabase.from(tabla).select("*");
            if (error) throw error;

            if (tabla === "articulos") {
                const articulosConImagenes = await Promise.all(
                    data.map(async (art) => {
                        if (!art.imagen_art) return { ...art, imagen_blob: null };

                        // Obtener URL firmada
                        const { data: signedURL, error: urlError } = await supabase.storage
                            .from("imagen_art")
                            .createSignedUrl(art.imagen_art, 60 * 60 * 6);

                        if (urlError) {
                            console.error(`Error al obtener la URL firmada para ${art.nombre_art}:`, urlError);
                            return { ...art, imagen_blob: null };
                        }

                        // Descargar la imagen como blob
                        try {
                            const response = await fetch(signedURL.signedUrl);
                            const blob = await response.blob();
                            return { ...art, imagen_blob: blob };
                        } catch (fetchError) {
                            console.error(`Error al descargar la imagen para ${art.nombre_art}:`, fetchError);
                            return { ...art, imagen_blob: null };
                        }
                    })
                );

                // Guardar artículos con blobs en IndexedDB
                await db.articulos.clear();
                await db.articulos.bulkAdd(articulosConImagenes);
            } else {
                // Guardar otras tablas
                await db[tabla].clear();
                await db[tabla].bulkAdd(data);
            }
        }
    } catch (error) {
        console.error("Error descargando datos de Supabase:", error);
    }
};
