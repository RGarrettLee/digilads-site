import Link from 'next/link';

export default function Navbar({ user }) {
   return (
      <>
         <div className='flex justify-end py-10 px-5 font-digivolve'>
            <ul className='list-none inline'>
               <Link href='/'><li className='hover:text-blue-200 inline px-2'>home</li></Link>
               <Link href='/leaderboard'><li className='hover:text-blue-200 inline px-2'>Leaderboard</li></Link>
               <Link href='/packOpening'><li className='hover:text-blue-200 inline px-2'>Pack Tracker</li></Link>
               {!user.id ? (
                  <Link href='/login'><li className='hover:text-blue-200 inline px-2'>login</li></Link>
               ) : (
                  <>
                     <Link href='/profile'><li className='hover:text-blue-200 inline px-2'>profile</li></Link>
                     <Link href='/logout'><li className='hover:text-blue-200 inline px-2'>logout</li></Link>
                  </>
               )}
            </ul>
         </div>
      </>
   )
}