import { createContext, useEffect, useReducer, useState } from "react"

export const GlobalContext = createContext();

function GlobalContextProvider({ children }) {
    /**para la navegacion interna */

    /**para la navegacion interna */

    /**Variables */
    const [email, setEmail] = useState("")
    const [nombreUsuario, setNombreUsuario,]= useState("")
    /**Variables */

    /**manejo de errores en la app */
    const showError = (type, message) => {
        setPopUp({ show: true, message: "", type: "error", zeIndex: "98", from: "MSJ" });
        setTimeout(() => {
            limpiarPopUp(1);
        }, 3000);
    };
    /**manejo de errores en la app */

    /** Popup */
    const [popUp, setPopUp] = useState({ show: false, message: "", type: "", zeIndex: "", from: "" });

    const limpiarPopUp = () => {
        setPopUp({
            show: false,
            message: "",
            type: "",
            from: "",
            zeIndex: ""
        })
    }
    /**Popup */

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

                email, setEmail,
                limpiarInput,


                nombreUsuario, setNombreUsuario,



            }
        }>
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalContextProvider
