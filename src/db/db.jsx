import Dexie from 'dexie';

const db = new Dexie('ptovta_compra');

db.version(2).stores({
    articulos: '++id_art, nombre_art, id_subcat, descripcion_art, codbar, valor_unit, imagen_art,Id_cat',
    categorias: '++id_cat, nombre_cat',
    subcategorias: '++id_subcat, nombre_subcat, id_cat',
    lista_prods: '++id_lista_prods, id_venta, id_art, valor_unit, cant, total_valor',
    historial: '++id_historial, fecha_venta, id_profile, id_lista_prods, total_valor, medio_pago_0, medio_pago_1, medio_pago_2, id_profile, estado',
    ventas: '++id_venta, fecha_venta, id_profile, id_lista_prods, total_valor, medio_pago_0, medio_pago_1, medio_pago_2, estado',
    settings: "key,user_id, nombre"
});

export default db;

