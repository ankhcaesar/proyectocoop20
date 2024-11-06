import styles from "./PopUp.module.css"
import iconError from "/Icons/exclamacion-rojo.svg"
import iconAtt from "/Icons/exclamacion-naranja.svg"
import iconOk from "/Icons/check.svg"
import InputForm from "../InputForm/Index"
import Botton from "../Botton/Index"
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext"
import { supabase } from "../../db/supabaseClient"

function PopUp({ type, message, zeIndex, from }) {
    const {
        nombreUsuario, setNombreUsuario,
        email, setEmail,

        limpiarPopUp,

        limpiarInput,

    } = useContext(GlobalContext)


    /**manejo del icono */
    const [icon, setIcon] = useState("")
    useEffect(() => {
        const cambiaricono = (tipo) => {
            switch (tipo) {
                case "ok":
                    setIcon(iconOk)

                    break;

                case "error":
                    setIcon(iconError)
                    break;
                case "att":
                    setIcon(iconAtt)
                    break;

                default:
                    break;
            }
        }
        cambiaricono(type)
    }, [])



    function manejarenvio(e) {
        e.preventDefault();

        if (from === "NVOUSR") {

            const crearNuevoUsuario = async (email) => {
                try {
                    const { data, error } = await supabase.auth.signUp({
                        email: email,
                        password: '123456'

                    })

                    if (error) {
                        console.error(error)
                        // Manejar el error de forma más específica, por ejemplo, mostrar un mensaje al usuario
                    } else {
                        console.log('Usuario creado exitosamente:', user)
                    }
                } catch (error) {
                    console.error('Error inesperado:', error)
                }
            }

            crearNuevoUsuario(email);

        }
    }


    return (
        <>
            {from === "MSJ" &&
                <div className={styles.PopUpContainer} style={{ zIndex: `${zeIndex}` }}>
                    <img className={styles.icono} src={icon} alt={`icono de ${type}`} />
                    <p className={styles.mensaje}>{message}</p>
                    <span className={styles.loader}></span>
                </div>
            }
            {from === "NVOUSR" &&
                <div className={styles.overlay}>
                    <div className={styles.PopUpContainer} style={{ zIndex: `${zeIndex}` }}>
                        <form
                            className={styles.formularioNuevoUsuario}
                            onSubmit={manejarenvio}

                        >
                            <label>Nombre del Usuario</label>
                            <InputForm
                                name="nombreUsuario"
                                placeholder="Ingresa tu nombre"
                                type="text"
                                value={nombreUsuario}
                                updatevalue={setNombreUsuario}
                                required={false}
                            />

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
                                    label="Registrar"
                                    type="submit"
                                    medida="40%"
                                />
                                <Botton
                                    name="botonLimpiar"
                                    label="Limpiar"
                                    type="button"
                                    medida="40%"
                                    onClick={limpiarInput}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            }






        </>
    )
}
export default PopUp