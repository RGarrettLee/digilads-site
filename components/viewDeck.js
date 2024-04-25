import { Dialog } from '@headlessui/react';

export default function ViewDeck({ toggle, setToggle, deck, user }) {

   return ( 
      <>
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
                  </Dialog.Panel>
               </div>
            </div>
         </Dialog>
      </>
   )
}