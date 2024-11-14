import { useState, useEffect } from 'react';
import { supabase } from '../db/supabaseClient';

export function useAuthStatus() {
    const [estaActivo, setEstaActivo] = useState(false);
    const [nuevoregistro, setNuevoregistro] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserProfile = async (userId) => {
            const { data, error } = await supabase
                .from("profile")
                .select("user_id")
                .eq("user_id", userId)
                .single();

            if (data) {
                setNuevoregistro(true);
            } else {
                setNuevoregistro(false);
            }
            setLoading(false);
        };

        const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
            const isActive = !!session;
            setEstaActivo(isActive);

            if (isActive && session.user) {
                checkUserProfile(session.user.id);
            } else {
                setLoading(false);
                setNuevoregistro(false);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return { estaActivo,setEstaActivo, nuevoregistro, loading };
}