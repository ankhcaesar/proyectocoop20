import styles from "./NuevoUsr.module.css";
import { useContext, useEffect, useState } from "react";
import InputForm from "../../components/InputForm/Index";
import Botton from "../../components/Botton/Index";
import SelectForm from "../../components/SelectForm/SelectForm";
import logo from "/Img/logo.svg";
import { GlobalContext } from "../../context/GlobalContext";
import { supabase } from "../../db/supabaseClient";
import { useAuthStatus } from '../../context/useAuthStatus';

function NuevoUsr() {
    const {
        setPopUp,
        limpiarPopUp,
        setCargador,
        ir,
        email,
        setEmail,
        nombreyApellido,
        setNombreyApellido
    } = useContext(GlobalContext);

    const [curso, setCurso] = useState("");
    const [cursosDisponibles, setCursosDisponibles] = useState([]);
    const { authState, loading } = useAuthStatus();

    useEffect(() => {
        if (!loading) {
            if (authState !== "SPERF") {
                ir("/");
            }
        }
    }, [authState, loading, ir]);

    useEffect(() => {
        const obtenerEmailUsuario = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
                setEmail(user.email);
            }
        };

        const obtenerOpcionesCurso = async () => {
            const { data, error } = await supabase.rpc('get_cursos');
            if (error) {
                console.error("Error obteniendo cursos:", error.message);
            } else {
                setCursosDisponibles(data);
            }
        };

        obtenerEmailUsuario();
        obtenerOpcionesCurso();
    }, []);




    const manejarEnvio = async (e) => {
        e.preventDefault();
        setCargador({ show: true });

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id;

            if (userId) {
                const { error } = await supabase
                    .from("profile")
                    .insert([{
                        user_id: userId,
                        nombreyapellido: nombreyApellido,
                        curso: curso,
                        email: email
                    }]);

                if (error) {
                    console.error("Error creando perfil:", error.message);
                    setPopUp({
                        show: true,
                        type: "error",
                        message: "Hubo un problema creando tu perfil. Inténtalo de nuevo.",
                        from: "MSJ",
                        zeIndex: "98",
                        duration: "3s"
                    });
                    setTimeout(() => {
                        limpiarPopUp();
                    }, 3000);
                } else {
                    setPopUp({
                        show: true,
                        type: "att",
                        message: `Gracias ${nombreyApellido}, puedes ingresar a la App.`,
                        from: "MSJ",
                        zeIndex: "98",
                        duration: "3s"
                    });
                    setTimeout(() => {
                        limpiarPopUp();
                    }, 3000);

                    ir("menuCompras")
                }
            }
        } catch (error) {
            console.error("Error al manejar el envío:", error);
        } finally {
            setCargador({ show: false });
        }
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
                <div className={styles.titulo}>
                    <h3>REGISTRO DE NUEVO USUARIO</h3>
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
                        readOnly={true} // Campo no editable
                    />
                    <label>Nombre y Apellido</label>
                    <InputForm
                        name="NombreyApellido"
                        placeholder="Ingresa tu nombre y apellido"
                        type="text"
                        value={nombreyApellido}
                        updatevalue={setNombreyApellido}
                        required={true}
                    />

                    <label>Curso</label>
                    <SelectForm
                        name="Curso"
                        value={curso}
                        updatevalue={setCurso}
                        opciones={cursosDisponibles}
                        required={true}
                    />
                    <div className={styles.boton}>
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

export default NuevoUsr;
