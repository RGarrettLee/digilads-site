import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SelectCardModal from '../../components/selectCardModal';
import ViewDeck from '../../components/viewDeck';
import PackBreakdown from '../../components/packBreakdown';
import supabase from '../../db/connection';

export default function Page() {
   const artAPI = 'https://images.digimoncard.io/images/cards/';
   const [users, setUsers] = useState([]);
   const [user, setUser] = useState({ notfound: false });
   const [openSelect, setOpenSelect] = useState(false);
   const [openView, setOpenView] = useState(false);
   const [view, setView] = useState({list: []});
   const [openPack, setOpenPack] = useState(false);
   const [pack, setPack] = useState({});
   const router = useRouter();

   useEffect(() => {
      async function getUsers() {
         await supabase.from('profiles').select('full_name, avatar_url, signature_card, decks, packs') // grab all relevant profile data
         .then((result) => {
            let notfound = true;
            setUsers([...result.data]);

            result.data.map((user) => {
               if (user.full_name === router.query.id) {
                  setUser(user);
                  notfound = false;
               }
            });

            if (notfound) {
               setUser( { notfound: true } );
            }
         })
      }

      getUsers();
   }, [router.query.id]);

   function viewDeck(deck) {
      setView(deck);
      setOpenView(true);
   }

   function viewPack(pack) {
      setPack(pack);
      setOpenPack(true);
   }

   return (
      <>
         {user?.full_name ? (
            <div className='flex flex-col'>
            <div className='flex items-center justify-center mb-6 gap-6'>
               <img className='rounded-full' height={100} width={100} src={user.avatar_url} alt='user pfp' />
               <h2 className='text-3xl font-digivolve'>{user.full_name}</h2>
            </div>
            <div className='grid grid-cols-2 mb-24'>
               <div className='flex flex-col items-center font-digivolve'>
                  {user.signature_card === '' || user.signature_card === null ? (
                     <></>
                     ) : (
                        <div className='flex flex-col items-center'>
                           <p className='text-2xl'>Signature Card</p>
                           <img className='rounded-2xl my-3' src={user.signature_card} alt='signature card' height={300} width={300} />
                           {/*<button onClick={() => setOpenSelect(true)} className='px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-600 active:bg-gray-500 duration-200 transition-colors'>Change Signature Card</button>*/}
                        </div>
                  )}
                  {/*<SelectCardModal toggle={openSelect} setToggle={setOpenSelect} cards={allCards} user={user}></SelectCardModal>*/}
               </div>
               <div className='grid grid-cols-3'>
                  <div className='flex flex-col items-center gap-2'>
                     <h2 className='text-2xl font-digivolve'>Decks</h2>
                     {/*<button onClick={() => setOpenDeck(true)} className='px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-600 active:bg-gray-500 duration-200 transition-colors font-digivolve'>Build New Deck</button>*/}
                     {/*<DeckBuilder toggle={openDeck} setToggle={setOpenDeck} cards={allCards} user={user}></DeckBuilder>*/}
                     {user?.decks ? (
                        <>
                           {user.decks.map((deck, index) => (
                              <div key={index}>
                                 <div className='flex flex-col items-center justify-center gap-1'>
                                    <p className='text-xl font-digivolve'>{deck.name}</p>
                                    {deck.coverCard !== '' ? (
                                       <img src={`${artAPI}${deck.coverCard}.jpg`} className='rounded-2xl' alt='cover card' height={150} width={150} />
                                    ) : (
                                       <></>
                                    )}
                                    <p className='text-md'>Wins <span className='text-lg font-semibold text-green-600'>{deck.wins}</span> / Losses <span className='text-lg font-semibold text-red-500'>{deck.losses}</span></p>
                                    <div className='flex items-center gap-2'>
                                       <button onClick={() => viewDeck(deck)} className='px-4 py-2 font-semibold bg-green-600 hover:bg-green-500 active:bg-green-400 rounded-lg duration-200 transition-colors'>View</button>
                                       {/*<button onClick={() => deleteDeck()} className='px-4 py-2 font-semibold bg-red-700 hover:bg-red-600 active:bg-red-500 rounded-lg duration-200 transition-colors'>Delete</button>*/}
                                    </div>
                                 </div>
                                 <ViewDeck toggle={openView} setToggle={setOpenView} deck={view} user={user} />
                              </div>
                           ))}
                        </>
                     ) : (
                        <></>
                     )}
                  </div>
                  <div className='flex flex-col items-center'>
                     <h2 className='text-2xl font-digivolve'>Opened Packs</h2>
                     {user?.packs.map((pack, index) => (
                        <div className='flex flex-col items-center justify-center gap-2' key={index}>
                           <h2 className='text-xl font-digivolve'>{pack.setName}</h2>
                           <div className='flex items-center justify-center gap-2'>
                              <button onClick={() => viewPack(pack)} className='px-4 py-2 font-semibold bg-green-600 hover:bg-green-500 active:bg-green-400 rounded-lg duration-200 transition-colors'>View</button>
                           </div>
                           <PackBreakdown collectedCards={pack.collectedCards} levelCards={pack.levelCards} attributeCards={pack.attributeCards} colourCards={pack.colourCards} typeCards={pack.typeCards} rarityCards={pack.rarityCards} digiTypeCards={pack.digiTypeCards} setName={pack.setName} toggle={openPack} setToggle={setOpenPack} typeLabels={pack.typeLabels} typeData={pack.typeData} user={user} profile={true} />
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
         ) : (
            <>
               {!user?.notfound ? (
                  <h2 className='text-center text-3xl font-digivolve'>loading profile...</h2>
               ) : (
                  <h2 className='text-center text-3xl font-digivolve'>That user does not exist</h2>
               )}
            </>
         )}
      </>
   )
}