import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStatus } from './useAuthStatus';

function Protegido(Component, redirectUrl = "/") {
    return function ComponenteProtegido(props) {
        const { authState, loading } = useAuthStatus();
        const navigate = useNavigate();

        useEffect(() => {
            if (!loading && authState !== "ACTIV") {
                navigate(redirectUrl);
            }
        }, [authState, loading, navigate, redirectUrl]);

        return authState === "ACTIV" ? <Component {...props} /> : null;
    };
}

export default Protegido;
