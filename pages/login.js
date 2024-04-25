import { useEffect } from 'react';
import supabase from '../db/connection';

export default function Login() {
   useEffect(() => {
      async function login() {
         await supabase.auth.signInWithOAuth({
            provider: 'discord'
         })
      }

      login();
   }, []);

   return (
      <>
         <h2 className='text-center text-2xl'>logging in...</h2>
      </>
   )
}

export async function getServerSideProps() {
   return {
      props: {}
   }
}