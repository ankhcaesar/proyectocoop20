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
        // Descarga las tablas desde Supabase
        const tablas = ["articulos", "categorias", "subcategorias"];
        for (const tabla of tablas) {
            const { data, error } = await supabase.from(tabla).select("*");
            if (error) throw error;

            // Inserta los datos en IndexedDB
            await db[tabla].clear();
            await db[tabla].bulkAdd(data);
        }
    } catch (error) {
        console.error("Error descargando datos de Supabase:", error);
    }
};
