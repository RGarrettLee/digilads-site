import { useState, useEffect } from 'react';
import SelectCardModal from '../components/selectCardModal';
import DeckBuilder from '../components/deckBuilder';
import ViewDeck from '../components/viewDeck';
import PackBreakdown from '../components/packBreakdown';
import supabase from '../db/connection';

export default function Profile( { user } ) {
   const { full_name, avatar_url, signature_card, decks, packs, collection } = user;
   const artAPI = 'https://images.digimoncard.io/images/cards/';
   const [allCards, setAllCards] = useState([]);
   const [openSelect, setOpenSelect] = useState(false);
   const [openDeck, setOpenDeck] = useState(false);
   const [openView, setOpenView] = useState(false);
   const [openPack, setOpenPack] = useState(false);
   const [deck, setDeck] = useState({});
   const [view, setView] = useState({list: []});
   const [savedPack, setPack] = useState({collectedCards: []});
   
   useEffect(() => {
      async function getAllCards() {
         fetch('https://digimoncard.io/api-public/getAllCards.php?sort=id&sortdirection=asc')
         .then((response) => response.json())
         .then((result) => {
            setAllCards([...result]);
         })
      }

      getAllCards();
   }, []);

   function viewDeck(deck) {
      setView(deck);
      setOpenView(true);
   }

   async function viewPack(pack) {
      /*if (pack.collectedCards.length <= 1) { // UNCOMMENT THIS IF SAVED PACK HAS NO SAVED COLLECTED CARD DATA
         let newCollectedCards = [];
         let userPacks = user.packs;
         let savedPack = pack;
         let index = userPacks.indexOf(pack);

         Object.keys(pack.typeCards).forEach((key) => {
            pack.typeCards[`${key}`].map((card) => {
               newCollectedCards.push(card);
            })
         });

         savedPack['collectedCards'] = newCollectedCards;
         userPacks.splice(index, 1);
         userPacks.push(savedPack);
   
         await supabase.from('profiles').update({ packs: userPacks }).eq('full_name', user.full_name);
      }*/

      setPack(pack);
      setOpenPack(true);
   }

   function editDeck(deck) {
      setDeck(deck);
      setOpenDeck(true);
   }

   async function deletePack(pack) {
      let userPacks = packs;
      let pos = userPacks.indexOf(pack);
      console.log(userPacks);
      let confirm = prompt(`Type the name of your pack to confirm deletion: ${pack.setName}`);

      if (confirm === pack.setName) {
         if (userPacks.length > 1) {
            userPacks.splice(pos, 1);
         } else {
            userPacks.shift();
         }
         await supabase.from('profiles').update({ packs: userPacks }).eq('full_name', full_name);
         window.location.reload();
      }
   }

   async function deleteDeck(deck) {
      let userDecks = decks;
      let pos = userDecks.indexOf(deck);
      let confirm = prompt(`Type the name of your deck to confirm deletion: ${deck.name}`);

      if (confirm === deck.name) {
         if (userDecks.length > 1) {
            userDecks.splice(pos, 1);
         } else {
            userDecks.shift();
         }
         await supabase.from('profiles').update({ decks: userDecks }).eq('full_name', user.full_name);
         window.location.reload();
      }
   }

   function exportDeck(deck) {
      let exportedDeck = '// Digimon Deck List\n';
      let exportedEggs = '//Egg Deck\n';
      deck.forEach((card) => {
         if (card.type !== 'Digi-Egg') {
            exportedDeck += `${card.quantity} ${card.name} ${card.id}\n`;
         } else {
            exportedEggs += `${card.quantity} ${card.name} ${card.id}\n`;
         }
      })
      exportedDeck += exportedEggs;
      
      navigator.clipboard.writeText(exportedDeck);

      window.alert('Copied deck list\n\n' + exportedDeck);
   }


   return (
      <>
         {user?.full_name ? (
            <div className='flex flex-col'>
               <div className='flex items-center justify-center mb-6 gap-6'>
                  <img className='rounded-full' height={100} width={100} src={avatar_url} alt='user pfp' />
                  <h2 className='text-3xl font-digivolve'>{full_name}</h2>
               </div>
               <div className='grid grid-cols-2 mb-24'>
                  <div className='flex flex-col items-center font-digivolve'>
                     {signature_card === '' ? (
                        <div className='mt-4'>
                           <button onClick={() => setOpenSelect(true)} className='px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-600 duration-200 transition-colors'>Set Signature Card</button>
                        </div>  
                        ) : (
                           <div className='flex flex-col items-center'>
                              <p className='text-2xl'>Signature Card</p>
                              <img className='rounded-2xl my-3' src={signature_card} alt='signature card' height={300} width={300} />
                              <button onClick={() => setOpenSelect(true)} className='px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-600 active:bg-gray-500 duration-200 transition-colors'>Change Signature Card</button>
                           </div>
                     )}
                     <SelectCardModal toggle={openSelect} setToggle={setOpenSelect} cards={allCards} user={user}></SelectCardModal>
                  </div>
                  <div className='grid grid-cols-3'>
                     <div className='flex flex-col items-center gap-2'>
                        <h2 className='text-2xl font-digivolve'>Decks</h2>
                        <button onClick={() => setOpenDeck(true)} className='px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-600 active:bg-gray-500 duration-200 transition-colors font-digivolve'>Build New Deck</button>
                        <DeckBuilder toggle={openDeck} setToggle={setOpenDeck} cards={allCards} user={user} brew={deck} setBrew={setDeck}></DeckBuilder>
                        {user.decks.map((deck, index) => (
                           <div key={index}>
                              <div className='flex flex-col items-center justify-center gap-1'>
                                 <p className='text-xl font-digivolve'>{deck.name}</p>
                                 {deck.coverCard !== '' ? (
                                    <img src={`${artAPI}${deck.coverCard}.jpg`} className='rounded-2xl' alt='cover card' height={150} width={150} />
                                 ) : (
                                    <></>
                                 )}
                                 {/*<p className='text-md'>Wins <span className='text-lg font-semibold text-green-600'>{deck.wins}</span> / Losses <span className='text-lg font-semibold text-red-500'>{deck.losses}</span></p>*/}
                                 <div className='flex items-center gap-2 mt-2'>
                                    <button onClick={() => viewDeck(deck)} className='px-4 py-2 font-semibold bg-green-600 hover:bg-green-500 active:bg-green-400 rounded-lg duration-200 transition-colors'>View</button>
                                    <button onClick={() => exportDeck(deck.list)} className='px-4 py-2 font-semibold bg-green-600 hover:bg-green-500 active:bg-green-400 rounded-lg duration-200 transition-colors'>Export</button>
                                    <button onClick={() => editDeck(deck)} className='px-4 py-2 font-semibold bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-300 rounded-lg duration-200 transition-colors'>Edit</button>
                                    <button onClick={() => deleteDeck(deck)} className='px-4 py-2 font-semibold bg-red-700 hover:bg-red-600 active:bg-red-500 rounded-lg duration-200 transition-colors'>Delete</button>
                                 </div>
                              </div>
                              <ViewDeck toggle={openView} setToggle={setOpenView} deck={view} user={user} />
                           </div>
                        ))}
                     </div>
                     <div className='flex flex-col items-center'>
                        <h2 className='text-2xl font-digivolve'>Opened Packs</h2>
                        {packs.map((pack, index) => (
                           <div className='flex flex-col items-center justify-center gap-2' key={index}>
                              <h2 className='text-xl font-digivolve'>{pack.setName}</h2>
                              <div className='flex items-center justify-center gap-2'>
                                 <button onClick={() => viewPack(pack)} className='px-4 py-2 font-semibold bg-green-600 hover:bg-green-500 active:bg-green-400 rounded-lg duration-200 transition-colors'>View</button>
                                 <button onClick={() => deletePack(pack)} className='px-4 py-2 font-semibold bg-red-700 hover:bg-red-600 active:bg-red-500 rounded-lg duration-200 transition-colors'>Delete</button>
                              </div>
                              <PackBreakdown collectedCards={savedPack.collectedCards} levelCards={savedPack.levelCards} attributeCards={savedPack.attributeCards} colourCards={savedPack.colourCards} typeCards={savedPack.typeCards} rarityCards={savedPack.rarityCards} digiTypeCards={savedPack.digiTypeCards} setName={savedPack.setName} toggle={openPack} setToggle={setOpenPack} typeLabels={savedPack.typeLabels} typeData={savedPack.typeData} user={user} profile={true} />
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         ) : (
            <>
               <h2 className='text-center text-2xl font-digivolve'>loading profile...</h2>
            </>
         )}
      </>
   )
}

/* 

TODO

figure out what is making is so when you close the team builder the unsaved changes persist
add pie chart using chart.js to team builder/team viewer to get a breakdown on levels & types of cards in deck

                     <div className='flex flex-col items-center'>
                        <h2 className='text-2xl font-digivolve'>Stats</h2>
                     </div>
                     <div className='flex flex-col items-center'>
                        <h2 className='text-2xl font-digivolve'>History</h2>
                     </div>

*/