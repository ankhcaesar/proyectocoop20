import styles from "./Inicio.module.css"
import { useNavigate } from "react-router-dom"
import logo from "/Img/logo.svg"
import InputForm from "../../components/InputForm/Index"
import Botton from "../../components/Botton/Index"
import PopUp from "../../components/PopUp/Index"
import { supabase } from "../../db/supabaseClient"
import { useContext } from "react"
import { GlobalContext } from "../../context/GlobalContext"


function Inicio() {
    const {
        popUp, setPopUp,
        limpiarPopUp,

        limpiarInput,

        email, setEmail

    } = useContext(GlobalContext)

    const navigate = useNavigate()

    const manejarEnvio = async (e) => {
        e.preventDefault()
        try {
            const result = await supabase.auth.signInWithOtp({
                email: email
            });
        } catch (error) {
            console.error(error)
        }
    }



    return (
        <section className={styles.containerPrincipal}>
            <div className={styles.containerLogo}>
                <div className={styles.logo}>
                    <img src={logo} alt="Logo cooperativa" />
                </div>
                <div className={styles.nombre}>
                    <h3>Unidad de</h3>
                    <h3>Abastecimiento</h3>
                </div>

            </div>
            <div className={styles.containerFormulario}>
                <form
                    className={styles.formulario}
                    onSubmit={manejarEnvio}
                >
                    <label>Email</label>
                    <InputForm
                        name="Email"
                        placeholder="Ingresa tu email"
                        type="email"
                        value={email}
                        updatevalue={setEmail}
                        required={true}
                    />
                    <div className={styles.botton}>
                        <Botton
                            name="botonEnvio"
                            label="Ingresar"
                            type="submit"
                        />
                    </div>
                </form>
                <div className={styles.nvoUsr}>
                    <p
                        onClick={() => setPopUp({
                            show: true,
                            type: "att",
                            message: "Nuevo usuario",
                            from: "NVOUSR",
                            zeIndex:"99"
                        })}> Nuevo usuario
                    </p>
                </div>
            </div>
            {popUp.show && <PopUp message={popUp.message} type={popUp.type} zeIndex={popUp.zeIndex} from={popUp.from} />}
        </section>
    )
}

export default Inicio