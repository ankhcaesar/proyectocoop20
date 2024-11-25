import styles from "./ListaFiltros.module.css";

function ListaFiltros({ items, selectedItem, onSelect, labelKey, idKey }) {
    return (
        <div className={styles.listaFiltros}>
            {items.map((item) => (
                <button
                    key={item[idKey]} 
                    className={`${styles.ListaFiltrosBoton} ${
                        selectedItem === item[idKey] ? styles.active : ""
                    }`}
                    onClick={() => onSelect(item[idKey])}
                >
                    {item[labelKey]}
                </button>
            ))}
        </div>
    );
}

export default ListaFiltros;
