import { Combobox } from '@headlessui/react';
import { useState } from 'react';

export default function PackSelector({ sets, setName, setSetName, setSetCards, allCards, setRarityCount }) {
   const [search, setSearch] = useState('');

   const filteredSets =
      search === ''
         ? []
         : sets.filter((set) => {
            return set.toLowerCase().includes(search.toLowerCase());
         });

   function createSet(set) {
      let cards = [];
      allCards.forEach((card) => {
         if (card.cardnumber.includes(set)) {
            cards.push({'name': card.name, 'type': '', 'color': '', 'color2': '', 'stage': '', 'attribute': '', 'level': 0, 'play_cost': 0, 'evolution_cost': 0, 'alt_effect': '', 'card_rarity': '', 'digi_type': '', 'digi_type2': '', 'id': card.cardnumber, 'main_effect': '', 'source_effect': '', 'quantity': 0, 'card_image': ''});
         }
      });
      cards.sort((a, b) => parseInt(a.id.replace('BT', '').replace('EX', '')) - parseInt(b.id.replace('BT', '').replace('EX', '')));
      setRarityCount([0, 0, 0, 0, 0]);
      setSetCards([...cards]);
      setSetName(set);
   }
   
   return (
      <>
         <Combobox as='div' className='flex flex-col items-center gap-2 z-40' value={setName} onChange={setSetName}>
            <p className='font-digivolve text-lg px-4'>Search Sets</p>
            <Combobox.Input className='bg-white text-black rounded-lg ring-2 ring-blue-200 py-1 px-2 text-center' autoFocus={true} value={search} onChange={(event) => setSearch(event.target.value)}></Combobox.Input>
            <Combobox.Options className='fixed mt-20 overflow-y-scroll no-scrollbar h-96 z-30 rounded-md'>
               <ul className='flex flex-col items-center rounded-lg bg-blue-500'>
                  {filteredSets.map((set, index) => (
                     <div key={index}>
                        <button onClick={() => createSet(set)} className='hover:bg-blue-400 hover:rounded-md'>
                           <Combobox.Option className={`text-center p-2 w-80 ${index === filteredSets.length-1 ? '' : 'border-b'}`} value={set}>
                              <div className='flex flex-col items-center'>
                                 <p className='rounded-2xl font-digivolve'>{set}</p>
                              </div>
                           </Combobox.Option>
                        </button>
                     </div>
                  ))}
               </ul>
            </Combobox.Options>
         </Combobox>
      </>
   )
}