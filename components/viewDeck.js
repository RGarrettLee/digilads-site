import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import LevelChart from '../components/levelChart';
import TypeChart from '../components/typeChart';

export default function ViewDeck({ toggle, setToggle, deck, user }) {
   const [deckData, setDeckData] = useState({});
   const [levelData, setLevelData] = useState([]);
   const [typeData, setTypeData] = useState([]);
   const [typeLabels, setTypeLabels] = useState([]);
   const [levelLabels, setLevelLabels] = useState([]);

   useEffect(() => {
      console.log(deck);
      let data = {levels: {}, types: {}};
      let levels = [];
      let types = [];

      deck.list.map((card) => {
         if (!levels.includes(card.level) && Number.isInteger(card.level)) {
            levels.push(card.level);
            data.levels[card.level] = 0;
         }
         if (!types.includes(card.type)) {
            types.push(card.type);
            data.types[card.type] = 0;
         }
      });

      levels.sort();
      types.sort();

      deck.list.map((card) => {
         levels.map((level) => {
            if (card.level === level) {
               data.levels[level] += parseInt(card.quantity);
            }
         });
         types.map((type) => {
            if (card.type === type) {
               data.types[type] += parseInt(card.quantity);
            }
         });
      });

      let levelCount = [];
      let levelLabels = [];
      let typeCount = [];

      levels.map((level) => {
         levelLabels.push(`Lvl ${level}`);
      });

      Object.keys(data.levels).map((level) => {
         levelCount.push(data.levels[level]);
      });

      types.map((type) => {
         Object.keys(data.types).map((ind) => {
            if (ind === type) {
               typeCount.push(data.types[ind]);
            }
         });
      });

      setDeckData(data);
      setLevelData(levelCount);
      setTypeData(typeCount);
      setTypeLabels(types);
      setLevelLabels(levelLabels);

   }, [deck])

   return ( 
      <>
         {deck?.name ? (
            <Dialog as='div' className='relative z-30' open={toggle} onClose={() => setToggle(false)}>
            <div className='fixed inset-0 overflow-y-auto'>
               <div className='flex flex-col min-h-full min-w-full items-center justify-center'>
                  <Dialog.Panel className='flex flex-col items-center justify-center bg-slate-900 py-20 rounded-2xl px-20 gap-4'>
                     <div className='flex flex-col items-center justify-center gap-1'>
                        <Dialog.Title className='font-digivolve text-4xl'>{deck.name}</Dialog.Title>
                        <p className='text-lg font-digivolve'>By {user.full_name}</p>
                     </div>
                     <p className='text-2xl font-digivolve'>Main Deck</p>
                     <div className='grid grid-cols-4 grid-rows-subgrid items-center justify-center gap-1'>
                        {deck.list.map((card, index) => (
                           <>
                              {card.type !== 'Digi-Egg' ? (
                                 <div className='flex flex-col justify-center items-center gap-2' key={index}>
                                    <img className='rounded-lg' src={card.image} alt='card art' height={150} width={150} />
                                    <div className='flex flex-col items-center justify-center'>
                                       <p className='text-center font-thin'>{card.name} <span className='text-green-500 font-bold'>x{card.quantity}</span></p>
                                       <p className='text-center font-thin'>{card.id}</p>
                                    </div>
                                 </div>
                              ) : (
                                 <></>
                              )}
                           </>
                        ))}
                     </div>
                     <p className='text-2xl font-digivolve'>Egg Deck</p>
                     <div className='flex justify-center items-center gap-2'>
                        {deck.list.map((card, index) => (
                           <>
                              {card.type === 'Digi-Egg' ? (
                                 <div className='flex flex-col justify-center items-center gap-2' key={index}>
                                    <img className='rounded-lg' src={card.image} alt='card art' height={150} width={150} />
                                    <div className='flex flex-col items-center justify-center'>
                                       <p className='text-center font-thin'>{card.name} <span className='text-green-500 font-bold'>x{card.quantity}</span></p>
                                       <p className='text-center font-thin'>{card.id}</p>
                                    </div>
                                 </div>
                              ) : (
                                 <></>
                              )}
                           </>
                        ))}
                     </div>
                     <div className='flex flex-col items-center justify-center mt-12'>
                        <p className='font-digivolve text-2xl'>Deck Breakdown</p>
                        <div className='flex items-center justify-center'>
                           <div className='flex flex-col items-center'>
                              <p className='font-digivolve text-xl'>Level Chart</p>
                              <LevelChart levelData={levelData} levelLabels={levelLabels} />
                           </div>
                           <div className='flex flex-col items-center'>
                              <p className='font-digivolve text-xl'>Type Chart</p>
                              <TypeChart typeData={typeData} typeLabels={typeLabels} />
                           </div>
                        </div>
                     </div>
                  </Dialog.Panel>
               </div>
            </div>
         </Dialog>
         ): (
            <></>
         )}
      </>
   )
}