import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      setUser(session?.user || null);
      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session?.user);
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    console.log("Signing out...");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      console.log("Sign out successful!");
      setUser(null); // Ensure state updates
      window.location.reload(); // Forces UI refresh
    }
  }

  return { user, loading, signOut };
}



// import { useState, useEffect } from 'react';
// import { supabase } from '../lib/supabase';
// import { User } from '@supabase/supabase-js';

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Get initial session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     // Listen for auth changes
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const signOut = async () => {
//     try {
//       setLoading(true);
      
//       // Clear local storage first
//       localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_URL + '-auth-token');
      
//       // Clear session state
//       setUser(null);
      
//       // Attempt to sign out from Supabase, but don't throw on error
//       try {
//         await supabase.auth.signOut();
//       } catch (error) {
//         console.warn('Error during Supabase sign out:', error);
//         // Continue execution even if this fails
//       }

//     } catch (error) {
//       console.error('Error during sign out:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { user, loading, signOut };
// }