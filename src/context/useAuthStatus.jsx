import { useState, useEffect } from 'react';
import { supabase } from '../db/supabaseClient'

export function useAuthStatus() {
    const [estaActivo, setEstaActivo] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((e, session) => {
            setEstaActivo(!!session); // true si hay una sesión, false si no
            setLoading(false); // La verificación ha terminado
        });

        // Limpia el listener cuando el componente se desmonte
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return { estaActivo, loading };
}