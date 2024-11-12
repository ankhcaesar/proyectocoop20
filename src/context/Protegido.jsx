import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from './GlobalContext';
import { useAuthStatus } from './useAuthStatus';


function Protegido(Component, redirectUrl = "/") {

    return function ComponenteProtegido(props) {
        const { estaActivo, loading } = useAuthStatus();
        const navigate = useNavigate();

        useEffect(() => {
            if (!loading && !estaActivo) {
                navigate(redirectUrl);
                
                
            }
        }, [estaActivo,loading, navigate, redirectUrl]);

        return estaActivo ? <Component {...props} /> : null;
    };
}

export default Protegido;