import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react';
import supabase from '../db/connection';

const inter = Inter({ subsets: ['latin'] })

export default function Home({ user }) {

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-3xl font-digivolve'>DigiLads</h1>
    </div>
  )
}
