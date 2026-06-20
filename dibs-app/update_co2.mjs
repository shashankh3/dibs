import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAnyd_PX0TRHTrBHwXjG5Chr8jf4Tieu8M",
  authDomain: "dibs-app-91806.firebaseapp.com",
  projectId: "dibs-app-91806",
  storageBucket: "dibs-app-91806.firebasestorage.app",
  messagingSenderId: "595370552825",
  appId: "1:595370552825:web:32ad1adad7fde7fe122128",
  measurementId: "G-CW07CVQMKY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const estimateCO2 = (titleStr) => {
  if (!titleStr) return 0.5;
  const t = titleStr.toLowerCase();
  
  if (t.match(/(fridge|refrigerator|washing machine|dryer|ac |air conditioner|dishwasher|motorcycle|scooter)/)) return 50 + Math.floor(Math.random() * 50);
  if (t.match(/(sofa|couch|bed|mattress|almirah|wardrobe|dining table|dresser|cabinet|oven|treadmill)/)) return 30 + Math.floor(Math.random() * 40);
  if (t.match(/(tv|television|desktop|pc|computer|monitor|printer|microwave|vacuum|bicycle|bike|cycle|desk|bookshelf)/)) return 15 + Math.floor(Math.random() * 10);
  if (t.match(/(chair|stool|shelf|table|console|playstation|xbox|stroller|car seat|guitar|keyboard instrument|luggage|suitcase|rug|carpet)/)) return 5 + Math.floor(Math.random() * 8);
  if (t.match(/(laptop|tablet|ipad|blender|mixer|toaster|iron|kettle|coffee maker|fan|heater|lamp|jacket|coat|boot|backpack|pot|pan|blanket)/)) return 2 + Math.floor(Math.random() * 3);
  if (t.match(/(phone|smartphone|mobile|book|textbook|novel|shirt|pant|jeans|dress|shoe|sneaker|bag|purse|towel|plate|bowl|cup|glass|utensil|vase|mirror|clock|toy|doll|puzzle|board game|lego)/)) return 0.5 + (Math.random() > 0.5 ? 0.5 : 0);
  if (t.match(/(earphone|headphone|tws|earbud|airpod|charger|cable|wire|mouse|keyboard|remote|usb|drive|battery|watch|sunglass|glass|trimmer|shaver|razor|brush|comb|perfume|makeup|pen|pencil|case|cover|wallet|stand|mount|holder)/)) return parseFloat((0.1 + Math.random() * 0.4).toFixed(1));
  if (t.match(/(sticker|pin|decal|tag|clip|band)/)) return 0.05;
  
  return 0.5;
};

async function updateAllItems() {
  console.log("Fetching all items from Firebase...");
  const snapshot = await getDocs(collection(db, 'items'));
  
  let updatedCount = 0;
  for (const itemDoc of snapshot.docs) {
    const data = itemDoc.data();
    const currentCO2 = data.co2;
    const newCO2 = estimateCO2(data.title);
    
    if (currentCO2 !== newCO2) {
      console.log(`Updating "${data.title}": ${currentCO2}kg -> ${newCO2}kg`);
      await updateDoc(doc(db, 'items', itemDoc.id), { co2: newCO2 });
      updatedCount++;
    } else {
      console.log(`Skipping "${data.title}" (Already ${newCO2}kg)`);
    }
  }
  
  console.log(`\nMigration Complete! Successfully updated ${updatedCount} items.`);
  process.exit(0);
}

updateAllItems().catch(console.error);
