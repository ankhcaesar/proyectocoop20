import { createContext, useEffect, useReducer, useState } from "react"
import { supabase } from "../db/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuthStatus } from "./useAuthStatus";



export const GlobalContext = createContext();

function GlobalContextProvider({ children }) {


    /**Variables */
    const [email, setEmail] = useState("")
    const thisUrl = "http://localhost:5173"
    const [nombreyApellido, setNombreyApellido] = useState("")
    const { setAuthState } = useAuthStatus();

    const navigate = useNavigate()
    /**Variables */


    /**manejo de errores en la app */
    const showError = (type, message) => {
        setPopUp({ show: true, message: "", type: "error", zeIndex: "98", from: "MSJ", duration: "3s" });
        setTimeout(() => {
            limpiarPopUp(1);
        }, 3000);
    };


    /** Cerrar sesion */
    async function cerrarSesion() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;


            setAuthState("SREG");
            setPopUp({ show: true, message: "Gracias por venir", type: "att", zeIndex: "98", from: "MSJ", duration: "3s" });

            localStorage.clear();
            sessionStorage.clear();

            document.cookie.split(";").forEach(cookie => {
                document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
            });

            if ("caches" in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(cache => caches.delete(cache)));
            }

            setTimeout(() => {
                limpiarPopUp(1);
                navigate("/");
            }, 3000);

        } catch (error) {
            console.error("Error al cerrar sesión:", error.message);
        }
    }

    /** Cerrar sesion */


    /**datos usuario */



    /**datos usuario */


    /** Popup */
    const [popUp, setPopUp] = useState({ show: false, message: "", type: "", zeIndex: "", from: "", duration: "" });
    const limpiarPopUp = () => {
        setPopUp({
            show: false,
            message: "",
            type: "",
            from: "",
            zeIndex: "",
            duration: ""
        })
    }
    /**Popup */


    /** Cargador */
    const [cargador, setCargador] = useState({ show: false, duration: "" })
    const cerrarCargador = () => {
        setCargador({
            show: false,
            duration: ""
        })
    }
    /** Cargador */

    /**Limpiar Imputs */
    const limpiarInput = () => {
        setEmail("");
        setNombreUsuario("");
    }
    /**Limpiar Imputs */



    return (
        <GlobalContext.Provider value={
            {
                popUp, setPopUp,
                limpiarPopUp,

                cargador, setCargador,
                cerrarCargador,

                email, setEmail,
                nombreyApellido, setNombreyApellido,

                limpiarInput,

                thisUrl,


                cerrarSesion,
            }
        }>
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalContextProvider
