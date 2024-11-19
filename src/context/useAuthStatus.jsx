import { useState, useEffect } from 'react';
import { supabase } from '../db/supabaseClient';

export function useAuthStatus() {
    const [authState, setAuthState] = useState("SREG"); // Estado inicial como "SREG"
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserProfile = async (userId) => {
            const { data } = await supabase
                .from("profile")
                .select("user_id")
                .eq("user_id", userId)
                .single();

            if (data) {
                setAuthState("ACTIV");
            } else {
                setAuthState("SPERF");
            }
            setLoading(false);
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

    return { authState,setAuthState, loading };
}
