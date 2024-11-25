import styles from "./SelectForm.module.css"

function SelectForm(props) {
    const manejarCambio = (e) => {
        props.updatevalue(e.target.value)
    }

    return (
        <select
            className={styles.form_select}
            value={props.value}
            required={props.required}
            onChange={manejarCambio}
        >
            <option 
            className={styles.opciones}
            value=""
            >Selecciona una opción</option>
            {props.opciones.map((opcion) => (
                <option key={opcion} value={opcion}>{opcion}</option>
            ))}
        </select>
    );
}

export default SelectForm;
