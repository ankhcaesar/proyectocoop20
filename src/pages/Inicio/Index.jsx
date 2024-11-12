import styles from "./Inicio.module.css"
import logo from "/Img/logo.svg"
import InputForm from "../../components/InputForm/Index"
import Botton from "../../components/Botton/Index"
import { supabase } from "../../db/supabaseClient"
import { useContext, useEffect  } from "react"
import { GlobalContext } from "../../context/GlobalContext"


function Inicio() {
    const {
        setPopUp,
        limpiarPopUp,

        setCargador,

        email, setEmail,

        estaActivo,
        navigation

    } = useContext(GlobalContext);


    /** manejar envio */
    const manejarEnvio = async (e) => {
        e.preventDefault()


        /** inicio de sesion y/o registro */
        setCargador({ show: true })
        const { error } = await supabase.auth.signInWithOtp({ email })
        if (error) {
            alert(error.error_description || error.message)
        } else {
            setPopUp({
                show: true,
                type: "att",
                message: `revisa tu email: ${email} para continuar`,
                from: "MSJ",
                zeIndex: "98",
                duration: "5s"
            });
            setTimeout(() => {
                limpiarPopUp();
            }, 5000);
        }
        setCargador({ show: false })
        /** inicio de sesion y / o registro */
    }
    /** manejar envio */

    
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
            </div>
        </section>
    )
}



export default Inicio