import styles from "./MenuCompras.module.css"
import Header from "../../components/Header/Index"
import Protegido from "../../context/Protegido"

function MenuCompras() {

    return (
        <>
            <Header titulo="Menu de compras" />
        </>
    )
}
export default Protegido(MenuCompras)