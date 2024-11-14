import styles from "./MenuCompras.module.css"
import Header from "../../components/Header/Index"
import Protegido from "../../context/Protegido"
import Botton from "../../components/Botton/Index"
import { useContext } from "react"
import { GlobalContext } from "../../context/GlobalContext"
function MenuCompras() {

const {cerrarSesion}=useContext(GlobalContext)
const salir = () => {
    cerrarSesion();
};
    return (
        <section className={styles.container}>
            <div>
            <Header titulo="Menu de compras" />
            </div>
            <div className={styles.opciones}>

                <Botton
                mane="Nueva Compra"
                label="NUEVA COMPRA"
                type="Button"
                />
                <Botton
                mane="Historial"
                label="HISTORIAL"
                type="Button"
                />
                <Botton
                mane="Salir"
                label="SALIR"
                type="Button"
                onClick={salir}
                />


            </div>





        </ section>
    )
}
export default Protegido(MenuCompras)