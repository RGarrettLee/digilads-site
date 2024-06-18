import { useState, useEffect } from 'react';
import PackSelector from '../components/packSelector';
import PackBreakdown from '../components/packBreakdown';
import supabase from '../db/connection';

export default function PackOpening({ user }) {
   const cardAPI = 'https://digimoncard.io/api-public/search.php?card=';
   const artAPI = 'https://images.digimoncard.io/images/cards/';
   const [allCards, setAllCards] = useState([]);
   const [setCode, setSetCode] = useState('');
   const [setCards, setSetCards] = useState([]);
   const [setNames, setSetNames] = useState([]);
   const [setName, setSetName] = useState('');
   const [rarityCount, setRarityCount] = useState([0, 0, 0, 0, 0]);
   const [breakdownToggle, setBreakdownToggle] = useState(false);
   const [collectedCards, setCollectedCards] = useState([]);
   const [levelCards, setLevelCards] = useState({});
   const [attributeCards, setAttributeCards] = useState({});
   const [colourCards, setColourCards] = useState({});
   const [typeCards, setTypeCards] = useState({});
   const [rarityCards, setRarityCards] = useState({});
   const [digiTypeCards, setDigiTypeCards] = useState({});
   const [typeLabels, setTypeLabels] = useState([]);
   const [typeData, setTypeData] = useState([]);
   const rarities = ['C', 'U', 'R', 'SR', 'SEC'];

   useEffect(() => {
      async function getAllCards() {
         fetch('https://digimoncard.io/api-public/getAllCards.php?sort=id&sortdirection=asc')
         .then((response) => response.json())
         .then((result) => {
            let sets = [];
            result.forEach((card) => {
               if (card.cardnumber.substring(4, 5) === '-') {
                  if (card.cardnumber.substring(0, 4).includes('BT') || card.cardnumber.substring(0, 4).includes('EX')) {
                     if (!sets.includes(card.cardnumber.substring(0, 4))) {
                        sets.push(card.cardnumber.substring(0, 4));
                     }
                  }
               } else {
                  if (card.cardnumber.substring(0, 3).includes('BT') || card.cardnumber.substring(0, 3).includes('EX')) {
                     if (!sets.includes(card.cardnumber.substring(0, 3))) {
                        sets.push(card.cardnumber.substring(0, 3));
                     }
                  }
               }
            });

            setAllCards([...result]);
            sets.sort((a, b) => a.replace('BT', '').replace('EX', '') - b.replace('BT', '').replace('EX', ''));
            setSetNames([...sets]);
         });
      }

      getAllCards();
   }, []);

   function inputChange(plus, quantity, index, card) {
      let newCards = setCards;
      let newCount = rarityCount;
      if (quantity === 0 && card.type === '') {
         fetch(`${cardAPI}${card.id}`)
         .then((response) => response.json())
         .then((result) => {
            let resultCard = result[0];
            newCards[index].type = resultCard.type;
            newCards[index].color = resultCard.color;
            newCards[index].color2 = resultCard.color2;
            newCards[index].stage = resultCard.stage;
            newCards[index].attribute = resultCard.attribute;
            newCards[index].level = resultCard.level;
            newCards[index].play_cost = resultCard.play_cost;
            newCards[index].evolution_cost = resultCard.evolution_cost;
            newCards[index].alt_effect = resultCard.alt_effect;
            newCards[index].card_rarity = resultCard.rarity;
            newCards[index].digi_type = resultCard.digi_type;
            newCards[index].digi_type2 = resultCard.digi_type2;
            newCards[index].main_effect = resultCard.main_effect.replace('Inherited Effect ', '');
            newCards[index].source_effect = resultCard.source_effect;
            newCards[index].card_image = `${artAPI}${card.id}.jpg`

            if (plus) {
               newCards[index].quantity = quantity + 1;
               switch(newCards[index].card_rarity.toLowerCase()) {
                  case "c": 
                     newCount[0] = rarityCount[0] + 1;
                     break;
                  case "u":
                     newCount[1] = rarityCount[1] + 1;
                     break;
                  case "r":
                     newCount[2] = rarityCount[2] + 1;
                     break;
                  case "sr":
                     newCount[3] = rarityCount[3] + 1;
                     break;
                  case "sec":
                     newCount[4] = rarityCount[4] + 1;
                     break;
                  default:
                     break;
               }
            } else if (!plus && quantity > 0) {
               newCards[index].quantity = quantity - 1;
               switch(newCards[index].card_rarity.toLowerCase()) {
                  case "c": 
                     newCount[0] = rarityCount[0] - 1;
                     break;
                  case "u":
                     newCount[1] = rarityCount[1] - 1;
                     break;
                  case "r":
                     newCount[2] = rarityCount[2] - 1;
                     break;
                  case "sr":
                     newCount[3] = rarityCount[3] - 1;
                     break;
                  case "sec":
                     newCount[4] = rarityCount[4] - 1;
                     break;
                  default:
                     break;
               }
            }
            setRarityCount([...newCount]);
         });
      }
      if (plus) {
         newCards[index].quantity = quantity + 1;
         switch(newCards[index].card_rarity.toLowerCase()) {
            case "c": 
               newCount[0] = rarityCount[0] + 1;
               break;
            case "u":
               newCount[1] = rarityCount[1] + 1;
               break;
            case "r":
               newCount[2] = rarityCount[2] + 1;
               break;
            case "sr":
               newCount[3] = rarityCount[3] + 1;
               break;
            case "sec":
               newCount[4] = rarityCount[4] + 1;
               break;
            default:
               break;
         }
      } else if (!plus && quantity > 0) {
         newCards[index].quantity = quantity - 1;
         switch(newCards[index].card_rarity.toLowerCase()) {
            case "c": 
               newCount[0] = rarityCount[0] - 1;
               break;
            case "u":
               newCount[1] = rarityCount[1] - 1;
               break;
            case "r":
               newCount[2] = rarityCount[2] - 1;
               break;
            case "sr":
               newCount[3] = rarityCount[3] - 1;
               break;
            case "sec":
               newCount[4] = rarityCount[4] - 1;
               break;
            default:
               break;
         }
      }
      setRarityCount([...newCount]);
      setSetCards([...newCards]);
   }

   function generateBreakdown() {
      let collectedCards = [];
      let rarities = [];
      let rarityCards = {};
      let attributes = [];
      let attributeCards = {};
      let cardTypes = [];
      let cardTypeCards = {};
      let digiTypes = [];
      let digiTypeCards = {};
      let levels = [];
      let levelCards = {};
      let colours = [];
      let colourCards = {};
      let typeData = [];

      setCards.map((card) => {
         if (card.quantity > 0) {
            collectedCards.push(card);
         }
      });

      collectedCards.map((card) => {
         if (!attributes.includes(card.attribute)) {
            if (card.type === 'Digimon') {
               attributes.push(card.attribute);
            }
         }
         if (!cardTypes.includes(card.type)) {
            cardTypes.push(card.type);
         }
         if (!rarities.includes(card.card_rarity.toLowerCase())) {
            rarities.push(card.card_rarity.toLowerCase());
         }
         if (!levels.includes(card.level)) {
            if (card.type === 'Digimon' || card.type === 'Digi-Egg') {
               levels.push(card.level);
            }
         }
         if (!colours.includes(card.color)) {
            colours.push(card.color);
         }
         if (!digiTypes.includes(card.digi_type)) {
            if (card.type === 'Digimon' || card.type === 'Digi-Egg') {
               if (card.digi_type !== null) {
                  digiTypes.push(card.digi_type);
               }
            }
         }
         if (!digiTypes.includes(card.digi_type2)) {
            if (card.type === 'Digimon' || card.type === 'Digi-Egg') {
               if (card.digi_type2 !== null) {
                  console.log(card.digi_type2);
                  digiTypes.push(card.digi_type2);
               }
            }
         }
      });

      levels.sort();
      cardTypes.sort();

      levels.map((level) => {
         if (!isNaN(level)) {
            levelCards[level] = [];
            collectedCards.map((card) => {
               if (card.level === level) {
                  levelCards[level].push(card);
               }
            });
         }
      });
   
      rarities.map((rarity) => {
         rarityCards[rarity] = [];
         collectedCards.map((card) => {
            if (card.card_rarity.toLowerCase() === rarity) {
               rarityCards[rarity].push(card);
            }
         });
      });

      attributes.map((attribute) => {
         attributeCards[attribute] = [];
         collectedCards.map((card) => {
            if (card.attribute === attribute) {
               attributeCards[attribute].push(card);
            }
         });
      });

      cardTypes.map((type) => {
         cardTypeCards[type] = [];
         collectedCards.map((card) => {
            if (card.type === type) {
               cardTypeCards[type].push(card);
            }
         });
      });

      colours.map((colour) => {
         colourCards[colour] = [];
         collectedCards.map((card) => {
            if (card.color === colour) {
               colourCards[colour].push(card);
            }
            if (card.color2 === colour) {
               colourCards[colour].push(card);
            }
         });
      });

      digiTypes.map((digiType) => {
         digiTypeCards[digiType] = [];
         collectedCards.map((card) => {
            if (!digiTypeCards[digiType].includes(card) && card.digi_type === digiType) {
               digiTypeCards[digiType].push(card);
            }
            if (!digiTypeCards[digiType].includes(card) && card.digi_type2 === digiType) {
               digiTypeCards[digiType].push(card);
            }
         });
      });

      let data = {types: {}};

      cardTypes.map((type) => {
         data.types[type] = 0;
      });

      collectedCards.map((card) => {
         cardTypes.map((type) => {
            if (card.type === type) {
               data.types[type] += card.quantity;
            }
         });
      });

      cardTypes.map((type) => {
         Object.keys(data.types).map((ind) => {
            if (ind === type) {
               typeData.push(data.types[ind]);
            }
         });
      });

      console.log(typeData);

      setLevelCards(levelCards);
      setRarityCards(rarityCards);
      setAttributeCards(attributeCards);
      setTypeCards(cardTypeCards);
      setColourCards(colourCards);
      setDigiTypeCards(digiTypeCards);
      setTypeLabels(cardTypes);
      setTypeData(typeData);
      setBreakdownToggle(true);
   }

   return (
      <div>
         <div className='flex flex-col justify-center items-center'>
            <PackSelector sets={setNames} setName={setName} setSetName={setSetName} setSetCards={setSetCards} allCards={allCards} setRarityCount={setRarityCount} />
            <div className='mt-4'>
               {allCards.length > 0 ? (
                  <div className='grid grid-cols-6 grid-rows-subgrid gap-6 mb-6'>
                     {setCards.map((card, index) => (
                        <div className='flex flex-col items-center gap-2' key={index}>
                           <img className='rounded-xl' src={`${artAPI}${card.id}.jpg`} alt='card image' width={220} height={220} />
                           <div className='flex justify-center items-center gap-3'>
                              <button onClick={() => inputChange(true, card.quantity, index, card)}>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-plus bg-green-500 rounded-lg" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/></svg>
                              </button>
                              <p className='font-digivolve text-xl'>{card.quantity}</p>
                              <button onClick={() => inputChange(false, card.quantity, index, card)}>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-dash bg-red-600 rounded-lg" viewBox="0 0 16 16"><path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/></svg>
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <></>
               )}
            </div>
         </div>
         <div className='fixed inset-y-96 z-30'>
            <div className='flex flex-col bg-zinc-400/25 backdrop-blur-md px-2 py-2 rounded-2xl'>
               <p className='font-digivolve text-center text-xl mb-2 underline-offset-4 underline'>Card Count</p>
               {rarities.map((rarity, index) => (
                  <div className='flex gap-3 my-1' key={index}>
                     <p className='font-digivolve text-xl'>{rarity}: {rarityCount[index]}</p>
                  </div>
               ))}
               <button onClick={() => generateBreakdown()} className='px-4 py-2 font-digivolve bg-green-700 hover:bg-green-600 active:bg-green-500 rounded-lg duration-200 transition-colors'>Show Breakdown</button>
            </div>
         </div>
         <PackBreakdown collectedCards={collectedCards} levelCards={levelCards} attributeCards={attributeCards} colourCards={colourCards} typeCards={typeCards} rarityCards={rarityCards} digiTypeCards={digiTypeCards} setName={setName} toggle={breakdownToggle} setToggle={setBreakdownToggle} typeLabels={typeLabels} typeData={typeData} user={user} profile={false} />
      </div>
   )
}