import { Dialog } from '@headlessui/react';

export default function CardDialog({ toggle, setToggle, card, addToDeck, quantity, updateQuantity, setCover }) {
   const artAPI = 'https://images.digimoncard.io/images/cards/';

   return (
      <>
         <Dialog as='div' className='relative z-50' open={toggle} onClose={() => setToggle(false)}>
            <div className='fixed inset-0 overflow-y-auto'>
               <div className='flex flex-col min-h-full min-w-full items-center justify-center'>
                  <Dialog.Panel className='flex flex-col items-center justify-center bg-gray-700 py-2 rounded-2xl px-2 gap-2 w-96'>
                     <Dialog.Title className='text-2xl font-digivolve'>{card.name}</Dialog.Title>
                     <div className='flex flex-col items-center justify-center gap-2'>
                        <img className='rounded-2xl' src={`${artAPI}${card.cardnumber}.jpg`} alt='card image' height={300} width={300} />
                        {card?.maineffect ? (
                           <>
                              <p className='text-lg font-digivolve underline underline-offset-4'>= Card Effect =</p>
                              <p className='text-center text-md font-thin'>{card.maineffect}</p>
                           </>
                        ) : (
                           <></>
                        )}
                        {card?.soureeffect ? (
                           <>
                              <p className='text-lg font-digivolve underline underline-offset-4'>= Inherited Effect =</p>
                              <p className='text-center text-md font-thin'>{card.soureeffect}</p>
                           </>
                        ) : (
                           <></>
                        )}
                     </div>
                     <div className='flex flex-col items-center justify-center gap-2'>
                        <div className='flex justify-center items-center gap-3'>
                           <button onClick={() => addToDeck()} className='px-4 py-2 bg-green-600 hover:bg-green-500 active:bg-green-400 rounded-lg duration-200 transition-colors'>Add Card</button>  
                           <button onClick={() => setCover(card)} className='px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-400 rounded-lg duration-200 transition-colors'>Make Cover Card</button>
                           <button onClick={() => setToggle(false)} className='px-4 py-2 bg-red-700 hover:bg-red-600 active:bg-red-500 rounded-lg duration-200 transition-colors'>Close</button>
                        </div>
                     </div>
                  </Dialog.Panel>
               </div>
            </div>
         </Dialog>
      </>
   )
}