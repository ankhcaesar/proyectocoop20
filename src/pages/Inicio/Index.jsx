import { useContext, useEffect } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import styles from "./Inicio.module.css";
import logo from "/Img/logo.svg";
import InputForm from "../../components/InputForm/Index";
import Botton from "../../components/Botton/Index";
import { useAuthStatus } from '../../context/useAuthStatus';
import { supabase } from "../../db/supabaseClient";

function Inicio() {
    const { setPopUp, limpiarPopUp, setCargador, ir, email, setEmail } = useContext(GlobalContext);
    const { authState, loading } = useAuthStatus();

    useEffect(() => {
        if (!loading) {
            if (authState === "ACTIV") {
                ir("MenuCompras");
            } else if (authState === "SPERF") {
                ir("NvoUsuario");
            }
        }
    }, [authState, loading, ir]);

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setCargador({ show: true });
        const { error } = await supabase.auth.signInWithOtp({ email });

        if (error) {
            alert(error.error_description || error.message);
        } else {
            setPopUp({
                show: true,
                type: "att",
                message: `Revisa tu email: ${email} para continuar`,
                from: "MSJ",
                zeIndex: "98",
                duration: "5s"
            });
            setTimeout(() => {
                limpiarPopUp();
            }, 5000);
        }
        setCargador({ show: false });
    };

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
                <form className={styles.formulario} onSubmit={manejarEnvio}>
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
    );
}

export default Inicio;
