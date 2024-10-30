import { createContext, useEffect, useReducer, useState } from "react"
import { useNavigate } from "react-router-dom"

export const GlobalContext = createContext();

function GlobalContextProvider({ children }) {
    /**para la navegacion interna */
    const navigate = useNavigate();


    return (
        <GlobalContext.Provider value={
            {



            }
        }>
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalContextProvider
