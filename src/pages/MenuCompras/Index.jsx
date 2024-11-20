import styles from "./MenuCompras.module.css"
import Header from "../../components/Header/Index"
import Protegido from "../../context/Protegido"
import Botton from "../../components/Botton/Index"
import { useContext } from "react"
import { GlobalContext } from "../../context/GlobalContext"
import { useNavigate } from "react-router-dom"
function MenuCompras() {
    const navigate = useNavigate();
    const { cerrarSesion } = useContext(GlobalContext)

    const ir = (to) => {
        switch (to) {
            case "CarritoCompras":
                navigate(`/${to}`)
                break;

            case "historial":
                navigate(`/${to}`)
                break;

            case "salir":
                cerrarSesion();
                break;
        }

    }
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
                    onClick={() => ir("CarritoCompras")}
                />
                <Botton
                    mane="Historial"
                    label="HISTORIAL"
                    type="Button"
                    onClick={() => ir("historial")}
                />
                <Botton
                    mane="Salir"
                    label="SALIR"
                    type="Button"
                    onClick={() => ir("salir")}
                />


            </div>





        </ section>
    )
}
export default Protegido(MenuCompras)