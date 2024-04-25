import { useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../db/connection';

export default function Logout() {
   const router = useRouter();

   useEffect(() => {
      async function logout() {
         const { error } = await supabase.auth.signOut();
         router.reload(window.location.origin);
      }

      logout();
   }, []);

   return (
      <>
         <h2 className='text-center font-digivolve text-2xl'>logging out...</h2>
      </>
   )
}

export async function getServerSideProps() {
   return {
      props: {}
   }
}