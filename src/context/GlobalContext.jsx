import { createContext, useEffect, useReducer, useState } from "react"
import { supabase } from "../db/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuthStatus } from "./useAuthStatus";
import { syncFromSupabase, syncToSupabase } from "../db/syncsrv";
import db from "../db/db";

export const GlobalContext = createContext();
function GlobalContextProvider({ children }) {


    /**Variables */
    const [email, setEmail] = useState("")
    const thisUrl = "http://localhost:5173"
    const [nombreyApellido, setNombreyApellido] = useState("")
    const { authState, setAuthState } = useAuthStatus();
    const navigate = useNavigate()
    /**Variables */



    /**Mantiene sincronizado el estado de idventa y statusventa */
    const [idVenta, setIdVenta] = useState(() => {
        const storedIdVenta = localStorage.getItem("idVenta");
        return storedIdVenta ? parseInt(storedIdVenta, 10) : null;
    });
    const [statusVenta, setStatusVenta] = useState(() => {
        const storedStatus = localStorage.getItem("statusVenta");
        return storedStatus === "true";
    });

    useEffect(() => {
        localStorage.setItem("idVenta", idVenta?.toString() || "");
        localStorage.setItem("statusVenta", statusVenta.toString());
    }, [idVenta, statusVenta]);
    /**Mantiene sincronizado el estado de idventa y statusventa */



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

            // Limpia el almacenamiento local
            localStorage.clear();
            sessionStorage.clear();

            // Limpia las cookies
            document.cookie.split(";").forEach(cookie => {
                document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
            });

            // Limpia el cache
            if ("caches" in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(cache => caches.delete(cache)));
            }

            // Limpia IndexedDB
            await Promise.all(db.tables.map((table) => table.clear())); // Limpia todas las tablas

            setTimeout(() => {
                limpiarPopUp();
                navigate("/");
            }, 3000);

        } catch (error) {
            console.error("Error al cerrar sesión:", error.message);
        }
    }
    /** Cerrar sesion */


 /**sincroniza datos */
 useEffect(() => {
    const sincronizar = async () => {
        try {
            if (authState === "ACTIV") {
                await syncToSupabase();
                await syncFromSupabase();
            }

            // Obtener nombre desde IndexedDB (settings)
            const settings = await db.settings.toArray();
            if (settings.length > 0) {
                setNombreyApellido(settings[0].nombre || "nn");
            } else {
                setNombreyApellido("nn");
            }
        } catch (error) {
            console.error("Error en la sincronización:", error);
        }
    };

    sincronizar();
}, [authState]); // Dependencias mínimas
/**sincroniza datos */


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

    /** popUpConfirm */
    const [popUpConfirm, setPopUpConfirm] = useState({ id: "", show: false, from: "", urlImagen: "", nombre: "", descripcion: "", valor: "" });
    const limpiarPopUpConfirm = () => {
        setPopUpConfirm({ show: false, from: "", urlImagen: "", nombre: "", descripcion: "", valor: "" });
    };
    /**popUpConfirm */

    /**funcion ir */
    function ir(to) {
        switch (to) {
            case "CarritoCompras":
                navigate(`/${to}`)
                break;

            case "Historial":
                navigate(`/${to}`)
                break;

            case "MenuCompras":
                navigate(`/${to}`)
                break;

            case "/":
                navigate(`${to}`)
                break

            case "AgrProductos":
                navigate(`${to}`);
                break;

                case "FinCompra":
                navigate(`${to}`);
                break;

            case "salir":
                cerrarSesion();
                break;
        }
    }
    //onClick={()=>ir("salir")} 
    /**funcion ir */

    /** funcion formato modena */
    function formatomoneda (valor) {
        return new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(valor);
      };
    /** funcion formato modena */

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

                popUpConfirm, setPopUpConfirm,
                limpiarPopUpConfirm,

                cargador, setCargador,
                cerrarCargador,

                email, setEmail,
                nombreyApellido, setNombreyApellido,

                limpiarInput,

                thisUrl,
                formatomoneda,

                ir,
                cerrarSesion,

                idVenta, setIdVenta,
                statusVenta, setStatusVenta,
            }
        }>
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalContextProvider
