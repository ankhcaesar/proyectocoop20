import { useState, useEffect } from 'react';
import { supabase } from '../db/supabaseClient';
import db from "../db/db";

export function useAuthStatus() {
    const [authState, setAuthState] = useState("SREG");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserProfile = async (userId) => {
            try {
                if (!navigator.onLine) {
                    // Modo offline
                    const profile = await db.settings.get("profile");
                    if (profile?.user_id === userId) {
                        setAuthState("ACTIV");
                    } else {
                        setAuthState("SPERF");
                    }
                } else {
                    // Modo online
                    const { data, error } = await supabase
                        .from("profile")
                        .select("user_id, nombreyapellido")
                        .eq("user_id", userId)
                        .single();

                    if (error && error.code !== "PGRST116") throw error; // Ignorar error si no encuentra el perfil
                    setAuthState(data ? "ACTIV" : "SPERF");

                    // Guardar estado en IndexedDB
                    if (data) {
                        await db.settings.put({
                            key: "profile",
                            user_id: data.user_id,
                            nombre: data.nombreyapellido
                        });
                    }
                }
            } catch (error) {
                console.error("Error verificando perfil:", error.message);
                setAuthState("SREG");
            } finally {
                setLoading(false);
            }
        };

        const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
            if (session?.user) {
                checkUserProfile(session.user.id);
            } else {
                setAuthState("SREG");
                setLoading(false);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return { authState, setAuthState, loading };
}
