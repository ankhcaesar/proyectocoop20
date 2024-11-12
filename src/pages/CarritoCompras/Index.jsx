import styles from "./CarritoCompras.module.css"
import Header from "../../components/Header/Index"
import Protegido from "../../context/Protegido"

function CarritoCompras() {


    return (
        <>
            <Header titulo="Carrito de compras" />
        </>
    )
}
export default Protegido(CarritoCompras)