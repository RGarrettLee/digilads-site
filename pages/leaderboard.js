import { useEffect, useState } from 'react';
import Link from 'next/link';
import supabase from '../db/connection';

export default function Leaderboard() {
   const [users, setUsers] = useState([]);

   useEffect(() => {
      async function getUsers() {
         await supabase.from('profiles').select('full_name, avatar_url')
         .then((result) => {
            // sort users by overall wins or winrate
            setUsers([...result.data]);
         })
      }

      getUsers();
   }, [setUsers]);

   return (
      <div className='flex flex-col items-center gap-8'>
         <h2 className='font-digivolve text-3xl underline underline-offset-4'>Leaderboard</h2>
         <div className='flex flex-col items-center justify-center gap-12'>
            {users.map((user, index) => (
               <div key={index}>
                  {index === 0 ? (
                     <Link className='flex flex-col items-center justify-center gap-2' href={`/profile/${user.full_name}`}>
                        <div className='flex items-center justify-center gap-4'>
                           <p className='text-4xl text-yellow-400 font-bold'>#{index+1}</p>
                           <img className='rounded-full' src={user.avatar_url} alt='pfp' height={100} width={100} />
                           <p className='text-2xl font-digivolve'>{user.full_name}</p>
                        </div>
                        <p className='font-thin text-lg'>Wins: <span className='text-green-500 text-lg font-semibold'>6</span> / Losses: <span className='text-red-600 text-lg font-semibold'>1</span></p>
                     </Link>
                  ) : (
                     <Link className='flex flex-col items-center justify-center gap-2' href={`/profile/${user.full_name}`}>
                        <div className='flex items-center justify-center gap-4'>
                           <p className='text-3xl text-gray-300 font-bold'>#{index+1}</p>
                           <img className='rounded-full' src={user.avatar_url} alt='pfp' height={100} width={100} />
                           <p className='text-2xl font-digivolve'>{user.full_name}</p>
                        </div>
                        <p className='font-thin text-lg'>Wins: <span className='text-green-500 text-lg font-semibold'>0</span> / Losses: <span className='text-red-600 text-lg font-semibold'>0</span></p>
                     </Link>
                  )}
               </div>
            ))}
         </div>
      </div>
   )
}