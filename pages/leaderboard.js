import { useEffect, useState } from 'react';
import supabase from '../db/connection';

export default function Leaderboard() {
   const [users, setUsers] = useState([]);

   useEffect(() => {
      async function getUsers() {
         await supabase.from('profiles').select('full_name, avatar_url')
         .then((result) => {
            console.log(result.data);
            setUsers([...result.data]);
         })
      }

      getUsers();
   }, [setUsers]);

   return (
      <div className='flex flex-col items-center'>
         <h2 className='font-digivolve text-3xl'>Leaderboard</h2>
      </div>
   )
}