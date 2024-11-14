import styles from "./InputForm.module.css"

function InputForm(props) {

    const manejarCambio = (e) => {
        props.updatevalue(e.target.value)
    }

    return (
        <input
            className={styles.form_text}
            placeholder={props.placeholder}
            value={props.value}
            type={props.type}
            required={props.required}
            readOnly={props.readOnly}
            onChange={manejarCambio}
        />
    )
}
export default InputForm