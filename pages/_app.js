import '@/styles/globals.css'
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/navbar';
import supabase from '../db/connection';

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState([]);
  const [auth, setAuth] = useState({});

  useEffect(() => {
    async function getUser() {
      let auth = {};
      await supabase.auth.getUser().then((value) => {
        if (value.data?.user) {
          auth = value.data.user;
          setAuth(auth);
        }
      })

      let updateAvatar = false;

      if (auth.length !== 0) {
        await supabase.from('profiles').select('id, full_name, avatar_url, signature_card, decks')
        .then((result) => {
          result.data.map((user) => {
            if (user.id === auth.id) {
              setUser(user);
              if (user.avatar_url !== auth.user_metadata.avatar_url) {
                console.log(auth.user_metadata.avatar_url);
                updateAvatar = true;
              }
            }
          })
        })
      }

      if (updateAvatar) {
        await supabase.from('profiles').update({ avatar_url: auth.user_metadata.avatar_url }).eq('id', auth.id);
      }
    }

    getUser();
  }, []);
  
  return (
    <div>
      <Head>
        <title>DigiLads</title>
        <meta charSet='UTF-8' />
        <meta name='description' content='The home of the DigiLads' />
      </Head>
      <Navbar user={user}></Navbar>
      <Component {...pageProps} user={user} auth={auth} />
    </div>
  )
}
