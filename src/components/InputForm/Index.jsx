import styles from "./InputForm.module.css"

function InputForm(props) {
    const { placeholder, value, type, required, readOnly, updatevalue, medida } = props

    const manejarCambio = (e) => {
        updatevalue(e.target.value)
    }

    return (
        <input
            style={{ width: `${props.medida}` }}
            className={styles.form_text}
            placeholder={placeholder}
            value={value}
            type={type}
            required={required}
            readOnly={readOnly}
            onChange={manejarCambio}
        />
    )
}
export default InputForm