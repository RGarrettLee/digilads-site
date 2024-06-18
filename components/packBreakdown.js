import { Dialog, Disclosure } from '@headlessui/react';
import { useState, useEffect } from 'react';
import supabase from '../db/connection';

export default function PackBreakdown({ collectedCards, levelCards, attributeCards, colourCards, typeCards, rarityCards, digiTypeCards, setName, toggle, setToggle }) {
   const artAPI = 'https://images.digimoncard.io/images/cards/';

   return (
      <>
         {collectedCards.length === 0 ? (
            <Dialog as='div' className='relative z-50' open={toggle} onClose={() => setToggle(false)}>
               <div className='fixed inset-0 overflow-y-auto'>
                  <div className='flex flex-col min-w-full min-h-full items-center justify-center gap-4'>
                     <Dialog.Panel className='flex flex-col items-center justify-center bg-blue-600 py-20 rounded-2xl px-20 gap-4'>
                        <Dialog.Title className='text-2xl font-digivolve'>{setName} Pack Breakdown</Dialog.Title>
                        <Disclosure>
                           <Disclosure.Button className='font-digivolve text-2xl bg-slate-900 hover:bg-slate-700 duration-200 transition-colors px-4 py-2 rounded-lg'>Colours</Disclosure.Button>
                           <Disclosure.Panel>
                              <div className='flex flex-col items-center justify-center gap-4'>
                                 {Object.keys(colourCards).map((colour, index) => (
                                    <>
                                       <p className='font-digivolve text-2xl'>{colour}</p>
                                       <div className='grid grid-cols-6 grid-rows-subgrid gap-6 items-center justify-center bg-slate-800 py-4 px-4 rounded-lg' key={index}>
                                          {colourCards[colour].map((card, ind) => (
                                             <div className='flex flex-col items-center' key={ind}>
                                                <img src={card.card_image} width={175} height={175} alt='card image'></img>
                                                <span className='text-green-400 font-bold text-lg'>x{card.quantity}</span>
                                             </div>
                                          ))}
                                       </div>
                                    </>
                                 ))}
                              </div>
                           </Disclosure.Panel>
                        </Disclosure>
                        <Disclosure>
                           <Disclosure.Button className='font-digivolve text-2xl bg-slate-900 hover:bg-slate-700 duration-200 transition-colors px-4 py-2 rounded-lg'>Levels</Disclosure.Button>
                           <Disclosure.Panel>
                              <div className='flex flex-col items-center justify-center gap-4'>
                                 {Object.keys(levelCards).map((level, index) => (
                                       <>
                                          <p className='font-digivolve text-2xl'>Lvl: {level}</p>
                                          <div className='grid grid-cols-6 grid-rows-subgrid gap-6 items-center justify-center bg-slate-800 py-4 px-4 rounded-lg' key={index}>
                                             {levelCards[level].map((card, ind) => (
                                                <div className='flex flex-col items-center' key={ind}>
                                                   <img src={card.card_image} width={175} height={175} alt='card image'></img>
                                                   <span className='text-green-400 font-bold text-lg'>x{card.quantity}</span>
                                                </div>
                                             ))}
                                          </div>
                                       </>
                                    ))
                                 }
                              </div>
                           </Disclosure.Panel>
                        </Disclosure>
                        <Disclosure>
                           <Disclosure.Button className='font-digivolve text-2xl bg-slate-900 hover:bg-slate-700 duration-200 transition-colors px-4 py-2 rounded-lg'>Rarities</Disclosure.Button>
                           <Disclosure.Panel>
                              <div className='flex flex-col items-center justify-center gap-4'>
                                 {rarityCards['c']?.length > 0 ? (
                                    <div className='flex flex-col items-center justify-center'> 
                                       <p className='font-digivolve text-2xl'>Common</p>
                                       <div className='grid grid-cols-6 grid-rows-subgrid gap-6 bg-slate-800 py-4 px-4 rounded-lg'>
                                          {rarityCards['c'].map((card, index) => (
                                             <div className='flex flex-col items-center' key={index}>
                                                <img src={card.card_image} width={175} height={175} alt='card image'></img>
                                                <span className='text-green-400 font-bold text-lg'>x{card.quantity}</span>
                                             </div>
                                          ))}
                                       </div>
                                    </div>
                                    ) : (
                                       <></>
                                    )
                                 }
                                 
                                 {rarityCards['u']?.length > 0 ? (
                                    <div className='flex flex-col items-center justify-center'> 
                                       <p className='font-digivolve text-2xl'>Uncommon</p>
                                       <div className='grid grid-cols-6 grid-rows-subgrid gap-6 bg-slate-800 py-4 px-4 rounded-lg'>
                                          {rarityCards['u'].map((card, index) => (
                                             <div className='flex flex-col items-center' key={index}>
                                                <img src={card.card_image} width={175} height={175} alt='card image'></img>
                                                <span className='text-green-400 font-bold text-lg'>x{card.quantity}</span>
                                             </div>
                                          ))}
                                       </div>
                                    </div>
                                    ) : (
                                       <></>
                                    )
                                 }

                                 {rarityCards['r']?.length > 0 ? (
                                    <div className='flex flex-col items-center justify-center'> 
                                       <p className='font-digivolve text-2xl'>Rare</p>
                                       <div className='grid grid-cols-6 grid-rows-subgrid gap-6 bg-slate-800 py-4 px-4 rounded-lg'>
                                          {rarityCards['r'].map((card, index) => (
                                             <div className='flex flex-col items-center justify-center' key={index}>
                                                <img src={card.card_image} width={175} height={175} alt='card image'></img>
                                                <span className='text-green-400 font-bold text-lg'>x{card.quantity}</span>
                                             </div>
                                          ))}
                                       </div>
                                    </div>
                                    ) : (
                                       <></>
                                    )
                                 }

                                 {rarityCards['sr']?.length > 0 ? (
                                    <div className='flex flex-col items-center justify-center'> 
                                       <p className='font-digivolve text-2xl'>Super Rare</p>
                                       <div className='grid grid-cols-6 grid-rows-subgrid gap-6 bg-slate-800 py-4 px-4 rounded-lg'>
                                          {rarityCards['sr'].map((card, index) => (
                                             <div className='flex flex-col items-center justify-center' key={index}>
                                                <img src={card.card_image} width={175} height={175} alt='card image'></img>
                                                <span className='text-green-400 font-bold text-lg'>x{card.quantity}</span>
                                             </div>
                                          ))}
                                       </div>
                                    </div>
                                    ) : (
                                       <></>
                                    )
                                 }

                                 {rarityCards['sec']?.length > 0 ? (
                                    <div className='flex flex-col items-center justify-center'> 
                                       <p className='font-digivolve text-2xl'>Secret Rare</p>
                                       <div className='grid grid-cols-6 grid-rows-subgrid gap-6 items-center justify-center bg-slate-800 py-4 px-4 rounded-lg'>
                                          {rarityCards['sec'].map((card, index) => (
                                             <div className='flex flex-col items-center' key={index}>
                                                <img src={card.card_image} width={175} height={175} alt='card image'></img>
                                                <span className='text-green-400 font-bold text-lg'>x{card.quantity}</span>
                                             </div>
                                          ))}
                                       </div>
                                    </div>
                                    ) : (
                                       <></>
                                    )
                                 }
                           </div>
                           </Disclosure.Panel>
                        </Disclosure>
                        <Disclosure>
                           <Disclosure.Button className='font-digivolve text-2xl bg-slate-900 hover:bg-slate-700 duration-200 transition-colors px-4 py-2 rounded-lg'>Card Type</Disclosure.Button>
                           <Disclosure.Panel>
                              <div className='flex flex-col items-center justify-center gap-4'>
                                 {Object.keys(typeCards).map((type, index) => (
                                    <>
                                       <p className='font-digivolve text-2xl'>{type}</p>
                                       <div className='grid grid-cols-6 grid-rows-subgrid gap-6 items-center justify-center bg-slate-800 py-4 px-4 rounded-lg' key={index}>
                                          {typeCards[type].map((card, ind) => (
                                             <div className='flex flex-col items-center' key={ind}>
                                                <img src={card.card_image} width={175} height={175} alt='card image'></img>
                                                <span className='text-green-400 font-bold text-lg'>x{card.quantity}</span>
                                             </div>
                                          ))}
                                       </div>
                                    </>
                                 ))}
                              </div>
                           </Disclosure.Panel>
                        </Disclosure>
                        <Disclosure>
                           <Disclosure.Button className='font-digivolve text-2xl bg-slate-900 hover:bg-slate-700 duration-200 transition-colors px-4 py-2 rounded-lg'>Attributes</Disclosure.Button>
                           <Disclosure.Panel>
                              <div className='flex flex-col items-center justify-center gap-4'>
                                 {Object.keys(attributeCards).map((attribute, index) => (
                                    <>
                                       <p className='font-digivolve text-2xl'>{attribute}</p>
                                       <div className='grid grid-cols-6 grid-rows-subgrid gap-6 items-center justify-center bg-slate-800 py-4 px-4 rounded-lg' key={index}>
                                          {attributeCards[attribute].map((card, ind) => (
                                             <div className='flex flex-col items-center' key={ind}>
                                                <img src={card.card_image} width={175} height={175} alt='card image'></img>
                                                <span className='text-green-400 font-bold text-lg'>x{card.quantity}</span>
                                             </div>
                                          ))}
                                       </div>
                                    </>
                                 ))}
                              </div>
                           </Disclosure.Panel>
                        </Disclosure>
                        <Disclosure>
                           <Disclosure.Button className='font-digivolve text-2xl bg-slate-900 hover:bg-slate-700 duration-200 transition-colors px-4 py-2 rounded-lg'>Digi Types</Disclosure.Button>
                           <Disclosure.Panel>
                              <div className='flex flex-col items-center justify-center gap-4'>
                                 {Object.keys(digiTypeCards).map((digiType, index) => (
                                    <>
                                       <p className='font-digivolve text-2xl'>{digiType}</p>
                                       <div className='grid grid-cols-6 grid-rows-subgrid gap-6 items-center justify-center bg-slate-800 py-4 px-4 rounded-lg' key={index}>
                                          {digiTypeCards[digiType].map((card, ind) => (
                                             <div className='flex flex-col items-center' key={ind}>
                                                <img src={card.card_image} width={175} height={175} alt='card image'></img>
                                                <span className='text-green-400 font-bold text-lg'>x{card.quantity}</span>
                                             </div>
                                          ))}
                                       </div>
                                    </>
                                 ))}
                              </div>
                           </Disclosure.Panel>
                        </Disclosure>
                     </Dialog.Panel>
                  </div>
               </div>
         </Dialog>
         ) : (
         <></>
      )}
      </>
   )
}


// colours, rarities, levels, card types, attributes, digitypes