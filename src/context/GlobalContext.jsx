import { createContext, useEffect, useReducer, useState } from "react"
import { supabase } from "../db/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuthStatus } from "./useAuthStatus";

export const GlobalContext = createContext();

function GlobalContextProvider({ children }) {


    /**Variables */
    const [email, setEmail] = useState("")
    const [nombreyApellido, setNombreyApellido] = useState("")
    const [curso, setCurso] = useState("")
    const { estaActivo,setEstaActivo, loading } = useAuthStatus();
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
            setEstaActivo(false) 
            setPopUp({ show: true, message: "Gracias por venir", type: "att", zeIndex: "98", from: "MSJ", duration: "3s" });
            setTimeout(() => {
                limpiarPopUp(1);
            }, 3000);
            navigate("/")
        } catch (error) {
            console.error('Error al cerrar sesión:', error.message);
            
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
                curso, setCurso,

                limpiarInput,



                estaActivo, 
                loading, 
                cerrarSesion,
              





            }
        }>
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalContextProvider
