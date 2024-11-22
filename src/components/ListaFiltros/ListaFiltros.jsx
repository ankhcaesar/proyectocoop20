import styles from "./ListaFiltros.module.css"


function ListaFiltros(props) {
    return (
        <div className={styles.listaFiltros}>
            {props.items.map((item) => (
                <button
                    key={props.item.id}
                    className={`${styles.toggleButton} ${
                        props.selectedItem === item.id ? styles.active : ""
                    }`}
                    onClick={() => props.onSelect(item.id)}
                >
                    {props.item[props.labelKey]}
                </button>
            ))}
        </div>
    );
}

export default ListaFiltros;


items, selectedItem, onSelect, labelKey 