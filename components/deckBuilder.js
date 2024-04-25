import { Dialog, Combobox } from '@headlessui/react';
import { useState, useEffect } from 'react';
import CardDialog from '../components/cardDialog';
import supabase from '../db/connection';

export default function DeckBuilder( { cards, toggle, setToggle, user, brew, setBrew }) {
   const artAPI = 'https://images.digimoncard.io/images/cards/';
   const cardAPI = 'https://digimoncard.io/api-public/search.php?card=';
   const [digimon, setDigimon] = useState({});
   const [showCard, setShowCard] = useState(false);
   const [deck, setDeck] = useState({ name: '', list: [], coverCard: '', wins: 0, losses: 0 });
   const [list, setList] = useState([]);
   const [eggCount, setEggCount] = useState(0);
   const [search, setSearch] = useState('');
   const [card, setCard] = useState({});
   const [cover, setCover] = useState({});
   const [deckName, setDeckName] = useState('');
   const [quantity, setQuantity] = useState(1);

   const deskImg = 200;

   useEffect(() => {
      if (brew?.name) {
         let eggs = 0;
         setList([...brew.list]);
         setDeckName(brew.name);
         setCover(brew.coverCard);
         brew.list.map((card) => {
            if (card.type === 'Digi-Egg') {
               eggs += parseInt(card.quantity);
            }
         });
         setEggCount(eggs);
      }
   }, [brew])

   async function selectedDigimon(card) {
      fetch(`${cardAPI}${card.cardnumber}`)
      .then((response) => response.json())
      .then((result) => {
         setCard(result[0]);
      });
      setShowCard(true);
      setSearch('');
   }

   function updateName(event) {
      setDeckName(event.target.value);
   }

   function updateQuantity(event) {
      let newList = list;
      newList[index].quantity = event.target.value;
      setList([...newList]);
   }

   function resetBuilder() {
      setToggle(false);
      setDeck({ name: '', list: [], coverCard: '', wins: 0, losses: 0 });
      setDigimon({});
      setList([]);
      setSearch('');
      setDeckName('');
      setQuantity(1);
      setEggCount(0);
      setCard({});
      setBrew({});
   }

   function getDeckSize() {
      let num = 0;

      list.map((card) => {
         if (card.type !== 'Digi-Egg') {
            num += parseInt(card.quantity);
         }
      });

      return num;
   }

   function addToDeck() {
      let updatedDeck = deck;
      let add = true;
      let update = false;

      list.map((digi) => {
         if (digi.id === card.cardnumber) {
            add = false;
         }
      });

      if (!add) {
         window.alert('You already have that card in the deck!');
      } else {
         update = true;
      }

      if (getDeckSize() + 1 > 50 && card.type !== 'Digi-Egg') {
         window.alert('You cannot exceed 50 cards!');
         update = false;
      } else {
         update = true;
      }

      if (card.type === 'Digi-Egg') {
         if (eggCount + 1 > 5) {
            window.alert('You cannot exceed 5 eggs!');
            update = false;
         } else {
            update = true;
            setEggCount(eggCount + 1);
         }
      }

      if (update) {
         let newList = list;
         newList.push({
            name: card.name,
            id: card.cardnumber,
            desc: card.maineffect,
            inherited: card.soureeffect,
            type: card.type,
            level: card.level,
            quantity: parseInt(quantity),
            image: `${artAPI}${card.cardnumber}.jpg`
         });
         // sort list
         newList.sort((a, b) => {
            return a.level - b.level;
         });
         updatedDeck.list = newList;
         setList([...newList]);
         setDeck(updatedDeck);
         setShowCard(false);
      }
   }

   async function saveNewDeck() {
      let userDecks = user.decks;
      let updatedDeck = deck;
      let save = false;
      let copy = false;
      let named = false;

      updatedDeck.name = deckName;
      updatedDeck.coverCard = cover.cardnumber;

      if (deckName === '') {
         window.alert('You need to give your deck a name!');
         named = false;
      } else {
         named = true;
      }

      if (getDeckSize() < 50) {
         window.alert('You cannot save a deck with under 50 cards in the main deck');
         save = false;
      } else {
         save = true;
      }

      userDecks.map((deck) => {
         if (deck.name === updatedDeck.name) {
            copy = true;
         }
      })

      if (copy) {
         window.alert('You have a deck with this name already!');
      }

      if (save && !copy && named) {
         userDecks.push(updatedDeck);
         await supabase.from('profiles').update({ decks: userDecks }).eq('full_name', user.full_name);
         resetBuilder();
      }
   }

   async function saveDeckEdits() {
      let userDecks = user.decks;
      let updatedDeck = brew;
      let pos = userDecks.indexOf(brew);

      updatedDeck.name = deckName;
      updatedDeck.coverCard = cover.cardnumber;
      updatedDeck.list = list;

      userDecks[pos] = updatedDeck;

      await supabase.from('profiles').update({ decks: userDecks }).eq('full_name', user.full_name);
      window.alert('Deck updated!');
   }

   const filteredDigimon =
      search === ''
         ? []
         : cards.filter((card) => {
            return card.name.toLowerCase().includes(search.toLowerCase())
         }).splice(0, 100);

   return (
      <>
         <Dialog as='div' className='relative z-30' open={toggle} onClose={() => null}>
            <div className='fixed inset-0 overflow-y-auto'>
               <div className='flex flex-col min-h-full min-w-full items-center justify-center'>
                  <Dialog.Panel className='flex flex-col items-center justify-center bg-slate-900 py-20 rounded-2xl px-20 gap-4'>
                     <Dialog.Title className='text-2xl font-digivolve'>Deck Builder</Dialog.Title>
                     <div className='flex items-center justify-center gap-24'>
                     <Combobox as='div' className='flex flex-col items-center gap-2' value={digimon} onChange={setDigimon}>
                           <p className='text-lg font-digivolve px-4'>Search Cards</p>
                           <Combobox.Input className='bg-white text-black rounded-lg ring-2 ring-blue-200 py-1 px-2 text-center' autoFocus={true} value={search} onChange={(event) => setSearch(event.target.value)}></Combobox.Input>
                           <Combobox.Options className='sticky overflow-y-scroll no-scrollbar h-96 z-30'>
                              <ul className='flex flex-col items-center rounded-lg bg-slate-600'>
                                 {filteredDigimon.map((card, index) => (
                                    <div key={index}>
                                       <button onClick={() => selectedDigimon(card)} className='hover:bg-slate-500 hover:rounded-md'>
                                          <Combobox.Option className={`text-center p-2 w-80 ${index === filteredDigimon.length-1 ? '' : 'border-b'}`} value={card}>
                                             <div className='flex flex-col items-center'>
                                                <img className='rounded-2xl' src={`${artAPI}${card['cardnumber']}.jpg`} alt='card image' height={deskImg} width={deskImg}></img>
                                                <p>{card.name}</p>
                                                <p className='text-sm font-semibold'>{card.cardnumber}</p>
                                             </div>
                                          </Combobox.Option>
                                       </button>
                                    </div>
                                 ))}
                              </ul>
                           </Combobox.Options>
                        </Combobox>
                        <div className='flex flex-col justify-center items-center gap-2'>
                           <p className='font-digivolve text-lg'>Deck Name</p>
                           <input onChange={(event) => updateName(event)} type='text' value={deckName} className='text-center bg-white text-black rounded-lg py-1 px-2'></input>
                        </div>
                     </div>
                     <div className='flex flex-col items-center justify-center'>
                        <div className='flex flex-col items-center justify-center gap-2'>
                           <p className='text-2xl font-digivolve'>Deck List | {getDeckSize()} cards in deck</p>
                           <div className='grid grid-cols-4 grid-rows-subgrid items-center justify-center gap-1'>
                              {list.map((card, index) => (
                                 <>
                                    {card.type !== 'Digi-Egg' ? (
                                       <div className='flex flex-col justify-center items-center gap-2' key={index}>
                                          <img className='rounded-lg' src={card.image} alt='card art' height={100} width={100} />
                                          <div className='flex flex-col items-center justify-center'>
                                             <p className='text-center font-thin'>{card.name} <span className='text-green-500 font-bold'>x{card.quantity}</span></p>
                                             <p className='text-center font-thin'>{card.id}</p>
                                             <div className='flex flex-col justify-center items-center gap-1'>
                                                <input type='number' value={card.quantity} max={4} min={1} onChange={(event) => {
                                                   let newList = list;
                                                   let value = event.target.value - card.quantity;
                                                   if (getDeckSize() + value > 50) {
                                                      window.alert('You cannot exceed 50 cards!');
                                                   } else {
                                                      newList[index].quantity = event.target.value;
                                                      setList([...newList]);
                                                   }
                                                }} className='text-center rounded-lg w-11'></input>
                                                <button onClick={() => {
                                                   let newList = list;
                                                   newList.splice(index, 1);
                                                   setList([...newList]);
                                                }} className='px-3 py-1 bg-red-700 hover:bg-red-600 active:bg-red-500 rounded-lg duration-200 transition-colors'>Delete</button>
                                             </div>
                                          </div>
                                       </div>
                                    ) : (
                                       <></>
                                    )}
                                 </>
                              ))}
                           </div>
                           <p className='text-2xl font-digivolve'>Egg Deck | {eggCount} eggs</p>
                           <div className='flex items-center justify-center gap-2'>
                              {list.map((card, index) => (
                                 <>
                                    {card.type === 'Digi-Egg' ? (
                                       <div className='flex flex-col justify-center items-center gap-2' key={index}>
                                          <img className='rounded-lg' src={card.image} alt='card art' height={100} width={100} />
                                          <div className='flex flex-col items-center justify-center'>
                                             <p className='text-center font-thin'>{card.name} <span className='text-green-500 font-bold'>x{card.quantity}</span></p>
                                             <p className='text-center font-thin'>{card.id}</p>
                                             <div className='flex flex-col justify-center items-center gap-1'>
                                                <input type='number' value={card.quantity} max={4} min={1} onChange={(event) => {
                                                   let newList = list;
                                                   let value = event.target.value - card.quantity;
                                                   if (eggCount + value > 5) {
                                                      window.alert('You cannot exceed 5 eggs!');
                                                   } else {
                                                      setEggCount(eggCount + value);
                                                      newList[index].quantity = event.target.value;
                                                      setList([...newList]);
                                                   }
                                                }} className='text-center rounded-lg w-11'></input>
                                                <button onClick={() => {
                                                      let newList = list;
                                                      setEggCount(eggCount - list[index].quantity);
                                                      newList.splice(index, 1);
                                                      setList([...newList]);
                                                   }} className='px-3 py-1 bg-red-700 hover:bg-red-600 active:bg-red-500 rounded-lg duration-200 transition-colors'>Delete</button>
                                             </div>
                                          </div>
                                       </div>
                                    ) : (
                                       <></>
                                    )}
                                 </>
                              ))}
                           </div>                           
                        </div>
                     </div>
                     <div className='flex justify-center items-center gap-4'>
                        {brew?.name ? (
                           <button onClick={() => saveDeckEdits()} className='px-4 py-2 bg-green-600 hover:bg-green-500 active:bg-green-400 rounded-lg duration-200 transition-colors'>Save Edits</button>
                        ) : (
                           <button onClick={() => saveNewDeck()} className='px-4 py-2 bg-green-600 hover:bg-green-500 active:bg-green-400 rounded-lg duration-200 transition-colors'>Save Deck</button>
                        )}
                        <button onClick={() => resetBuilder()} className='px-4 py-2 bg-red-700 hover:bg-red-600 active:bg-red-500 rounded-lg duration-200 transition-colors'>Close Builder</button>
                     </div>
                  </Dialog.Panel>
               </div>
            </div>
         </Dialog>
         <CardDialog toggle={showCard} setToggle={setShowCard} card={card} addToDeck={addToDeck} quantity={quantity} updateQuantity={updateQuantity} setCover={setCover} />
      </>
   )
}