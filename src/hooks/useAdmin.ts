import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // Wait for authentication to load

    if (user) {
      const checkAdminStatus = async () => {
        setAdminLoading(true);
        try {
          const { data, error } = await supabase
            .from('admin_users') // Query the admin_users table
            .select('role') // Select the role column
            .eq('user_id', user.id) // Match user_id with auth.users.id
            .single();

          if (error) {
            console.error('Error fetching admin role:', error);
            setIsAdmin(false);
          } else {
            setIsAdmin(data?.role === 'admin'); // Check if the role is 'admin'
            console.log('Admin role check:', data?.role === 'admin');
          }
        } catch (err) {
          console.error('Error during admin role fetch:', err);
          setIsAdmin(false);
        } finally {
          setAdminLoading(false);
        }
      };

      checkAdminStatus();
    } else {
      setIsAdmin(false);
      setAdminLoading(false);
    }
  }, [user, authLoading]);

  return { isAdmin, adminLoading };
}



// import { useState, useEffect } from 'react';
// import { supabase } from '../lib/supabase';
// import { useAuth } from './useAuth';

// export function useAdmin() {
//   const { user } = useAuth();
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [isEditor, setIsEditor] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function checkAdminStatus() {
//       if (!user) {
//         setIsAdmin(false);
//         setIsEditor(false);
//         setLoading(false);
//         return;
//       }

//       try {
//         // Query admin_users table with proper column reference
//         const { data: adminData, error: adminError } = await supabase
//           .from('admin_users')
//           .select('role')
//           .eq('user_id', user.id)
//           .single();

//         if (adminError) throw adminError;

//         setIsAdmin(adminData?.role === 'admin');
//         setIsEditor(adminData?.role === 'editor' || adminData?.role === 'admin');
//       } catch (error) {
//         console.error('Error checking admin status:', error);
//         setIsAdmin(false);
//         setIsEditor(false);
//       } finally {
//         setLoading(false);
//       }
//     }

//     checkAdminStatus();
//   }, [user]);

//   return { isAdmin, isEditor, loading };
// }