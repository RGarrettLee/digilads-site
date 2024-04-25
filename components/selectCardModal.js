import { Dialog, Combobox } from '@headlessui/react';
import { useState } from 'react';
import supabase from '../db/connection';

export default function SelectCardModal( { toggle, setToggle, cards, user } ) {
   const artAPI = 'https://images.digimoncard.io/images/cards/';
   const [digimon, setDigimon]  = useState('');
   const [search, setSearch] = useState('');
   const [card, setCard ] = useState({});
   const [cardImage, setCardImage] = useState('');
   const deskImg = 200;

   function selectedDigimon(card) {
      setCard(card);
      setCardImage(`${artAPI}${card['cardnumber']}.jpg`);
      setSearch('');
   }

   async function updateSignatureCard() {
      if (card?.name) {
         let newSignature = cardImage;
         await supabase.from('profiles').update({signature_card: newSignature}).eq('full_name', user.full_name);
         setToggle(false);
         window.location.reload();
      }
   }

   const filteredDigimon =
      search === ''
         ? []
         : cards.filter((card) => {
            return card.name.toLowerCase().includes(search.toLowerCase())
         }).splice(0, 100)
  
   return (
      <>
         <Dialog as='div' className='relative z-50' open={toggle} onClose={() => setToggle(false)}>
            <div className='fixed inset-0 overflow-y-auto'>
               <div className='flex flex-col min-h-full min-w-full items-center justify-center'>
                  <Dialog.Panel className='flex flex-col items-center justify-center bg-slate-900 py-4 rounded-2xl px-4 gap-2'>
                     <Dialog.Title className='text-2xl px-4'>Search cards</Dialog.Title>
                     <div className='flex flex-col items-center gap-4'>
                        {card?.name ? (
                              <div className='flex flex-col items-center gap-4'>
                                 <img className='rounded-2xl' src={`${artAPI}${card['cardnumber']}.jpg`} alt='card image' height={deskImg} width={deskImg}></img>
                                 <button onClick={() => updateSignatureCard()} className='px-4 py-2 bg-green-600 rounded-md hover:bg-green-400 duration-200 transition-colors'>Update Signature Card</button>
                              </div>
                           ) : (
                              <></>
                        )}
                        <Combobox as='div' className='flex flex-col items-center gap-2 mt-2' value={digimon} onChange={setDigimon}>
                           <Combobox.Input className='bg-white text-black rounded-lg ring-2 ring-blue-200 py-1 px-2 text-center' autoFocus={true} value={search} onChange={(event) => setSearch(event.target.value)}></Combobox.Input>
                           <Combobox.Options className='overflow-y-scroll no-scrollbar h-96'>
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
                     </div>
                  </Dialog.Panel>
               </div>
            </div>
         </Dialog>
      </>
   )
}