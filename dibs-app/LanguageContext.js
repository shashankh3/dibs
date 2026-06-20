import React, { createContext, useState, useContext } from 'react';

const translations = {
  en: {
    langName: "English",
    dibs: "DIBS!", pass: "PASS", raddi: "RADDI", condition: "Condition", free: "Free",
    listAnItem: "List an Item", saveItemsLandfill: "Save items from the landfill.",
    whatIsIt: "What is it?", vintageLampPlaceholder: "e.g., Vintage Lamp", pricePlaceholder: "Price (leave empty for Free)",
    address: "Pickup Address", addressPlaceholder: "e.g., Sector 4, Near Metro",
    pincodeLabel: "Pincode", enterPincode: "Enter Pincode...", search: "Go",
    good: "Good", needsRepair: "Repair", listItemBtn: "List Item", selectLanguage: "Select Language",
    vintageChair: "Vintage Office Chair", brokenMonitor: "Broken CRT Monitor",
    usedGood: "Used - Good", scrap: "Scrap", likeNew: "Like New", forParts: "For Parts",
    tapToAddPhoto: "Tap to add a photo",
    // New Keys
    chats: "Messages", typeMessage: "Type a message...", send: "Send",
    directory: "Local Kabadiwalas", callNow: "Call Now", rating: "Rating",
    activeScrapBatches: "Tracking scrap payload in this zone."
  },
  hi: {
    langName: "हिंदी (Hindi)",
    dibs: "चाहिए!", pass: "छोड़ें", raddi: "रद्दी", condition: "स्थिति", free: "मुफ़्त",
    listAnItem: "सामान जोड़ें", saveItemsLandfill: "कबाड़ से बचाएं।",
    whatIsIt: "यह क्या है?", vintageLampPlaceholder: "जैसे, पुराना लैंप", pricePlaceholder: "कीमत (मुफ़्त के लिए खाली)",
    address: "पिकअप का पता", addressPlaceholder: "जैसे, सेक्टर 4",
    pincodeLabel: "पिनकोड", enterPincode: "पिनकोड दर्ज करें...", search: "खोजें",
    good: "अच्छा", needsRepair: "मरम्मत", listItemBtn: "सामान जोड़ें", selectLanguage: "भाषा चुनें",
    vintageChair: "विंटेज चेयर", brokenMonitor: "टूटा मॉनिटर",
    usedGood: "इस्तेमाल - अच्छा", scrap: "कबाड़", likeNew: "नए जैसा", forParts: "पुर्जों के लिए",
    tapToAddPhoto: "फोटो जोड़ने के लिए टैप करें",
    chats: "संदेश", typeMessage: "संदेश लिखें...", send: "भेजें",
    directory: "स्थानीय कबाड़ीवाले", callNow: "अभी कॉल करें", rating: "रेटिंग",
    activeScrapBatches: "इस ज़ोन में पेलोड ट्रैक किया जा रहा है।"
  },
  mr: {
    langName: "मराठी (Marathi)",
    dibs: "पाहिजे!", pass: "नको", raddi: "रद्दी", condition: "स्थिती", free: "मोफत",
    listAnItem: "वस्तूची नोंद करा", saveItemsLandfill: "कचऱ्यात जाण्यापासून वाचवा.",
    whatIsIt: "हे काय आहे?", vintageLampPlaceholder: "उदा. जुना दिवा", pricePlaceholder: "किंमत (मोफतसाठी रिकामे)",
    address: "पिकअपचा पत्ता", addressPlaceholder: "उदा. सेक्टर 4",
    pincodeLabel: "पिनकोड", enterPincode: "पिनकोड टाका...", search: "शोधा",
    good: "उत्तम", needsRepair: "दुरुस्ती", listItemBtn: "वस्तू नोंदवा", selectLanguage: "भाषा निवडा",
    vintageChair: "विंटेज चेअर", brokenMonitor: "तुटलेला मॉनिटर",
    usedGood: "वापरलेले - चांगले", scrap: "भंगार", likeNew: "नव्यासारखे", forParts: "भागांसाठी",
    tapToAddPhoto: "फोटो जोडण्यासाठी टॅप करा",
    chats: "संदेश", typeMessage: "संदेश लिहा...", send: "पाठवा",
    directory: "स्थानिक भंगारवाले", callNow: "आता कॉल करा", rating: "रेटिंग",
    activeScrapBatches: "या झोनमध्ये पेलोड ट्रॅक करत आहे."
  },
  bn: {
    langName: "বাংলা (Bengali)",
    dibs: "চাই!", pass: "বাদ দিন", raddi: "রদ্দি", condition: "অবস্থা", free: "বিনামূল্যে",
    listAnItem: "জিনিস যোগ করুন", saveItemsLandfill: "আবর্জনা থেকে বাঁচান।",
    whatIsIt: "এটি কি?", vintageLampPlaceholder: "যেমন, ল্যাম্প", pricePlaceholder: "মূল্য (বিনামূল্যের জন্য খালি)",
    address: "পিকআপের ঠিকানা", addressPlaceholder: "যেমন, সেক্টর 4",
    pincodeLabel: "পিনকোড", enterPincode: "পিনকোড লিখুন...", search: "খুঁজুন",
    good: "ভালো", needsRepair: "মেরামত", listItemBtn: "যোগ করুন", selectLanguage: "ভাষা নির্বাচন করুন",
    vintageChair: "ভিন্টেজ চেয়ার", brokenMonitor: "ভাঙা মনিটর",
    usedGood: "ব্যবহৃত - ভালো", scrap: "স্ক্র্যাপ", likeNew: "নতুনের মতো", forParts: "যন্ত্রাংশের জন্য",
    tapToAddPhoto: "ছবি যোগ করতে ট্যাপ করুন",
    chats: "বার্তা", typeMessage: "বার্তা লিখুন...", send: "পাঠান",
    directory: "স্থানীয় কাবারিওয়ালা", callNow: "কল করুন", rating: "রেটিং",
    activeScrapBatches: "এই জোনে স্ক্র্যাপ ট্র্যাক করা হচ্ছে।"
  },
  ta: {
    langName: "தமிழ் (Tamil)",
    dibs: "வேண்டும்!", pass: "தவிர்", raddi: "ரத்தி", condition: "நிலை", free: "இலவசம்",
    listAnItem: "பொருளைப் பட்டியலிடு", saveItemsLandfill: "குப்பையிலிருந்து காப்பாற்றுங்கள்.",
    whatIsIt: "இது என்ன?", vintageLampPlaceholder: "எ.கா. விளக்கு", pricePlaceholder: "விலை (இலவசத்திற்கு காலி)",
    address: "முகவரி", addressPlaceholder: "எ.கா. செக்டார் 4",
    pincodeLabel: "பின்கோடு", enterPincode: "பின்கோடு...", search: "தேடு",
    good: "நன்று", needsRepair: "பழுது", listItemBtn: "பதிவிடு", selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    vintageChair: "பழைய நாற்காலி", brokenMonitor: "உடைந்த மானிட்டர்",
    usedGood: "நன்று", scrap: "கழிவு", likeNew: "புதியது", forParts: "பாகங்களுக்கு",
    tapToAddPhoto: "புகைப்படம் சேர்க்க தட்டவும்",
    chats: "செய்திகள்", typeMessage: "செய்தியை தட்டச்சு செய்க...", send: "அனுப்பு",
    directory: "உள்ளூர் வியாபாரிகள்", callNow: "அழைக்க", rating: "மதிப்பீடு",
    activeScrapBatches: "இந்த மண்டலத்தில் கண்காணிக்கப்படுகிறது."
  },
  te: {
    langName: "తెలుగు (Telugu)",
    dibs: "కావాలి!", pass: "వద్దు", raddi: "రద్ది", condition: "స్థితి", free: "ఉచితం",
    listAnItem: "వస్తువును చేర్చండి", saveItemsLandfill: "పారేయకుండా కాపాడండి.",
    whatIsIt: "ఇది ఏమిటి?", vintageLampPlaceholder: "ఉదా. దీపం", pricePlaceholder: "ధర (ఉచితం అయితే ఖాళీ)",
    address: "చిరునామా", addressPlaceholder: "ఉదా. సెక్టార్ 4",
    pincodeLabel: "పిన్‌కోడ్", enterPincode: "పిన్‌కోడ్...", search: "వెతుకు",
    good: "బాగుంది", needsRepair: "రిపేర్", listItemBtn: "జోడించు", selectLanguage: "భాషను ఎంచుకోండి",
    vintageChair: "పాత చైర్", brokenMonitor: "పాడైన మానిటర్",
    usedGood: "వాడినది", scrap: "స్క్రాప్", likeNew: "కొత్తది", forParts: "భాగాల కోసం",
    tapToAddPhoto: "ఫోటో జోడించడానికి నొక్కండి",
    chats: "సందేశాలు", typeMessage: "సందేశాన్ని టైప్ చేయండి...", send: "పంపు",
    directory: "స్థానిక కబాడివాలాలు", callNow: "కాల్ చేయండి", rating: "రేటింగ్",
    activeScrapBatches: "ఈ జోన్‌లో స్క్రాప్ ట్రాక్ చేయబడుతోంది."
  },
  kn: {
    langName: "ಕನ್ನಡ (Kannada)",
    dibs: "ಬೇಕು!", pass: "ಬಿಡಿ", raddi: "ರದ್ದಿ", condition: "ಸ್ಥಿತಿ", free: "ಉಚಿತ",
    listAnItem: "ಪಟ್ಟಿ ಮಾಡಿ", saveItemsLandfill: "ಕಸಕ್ಕೆ ಸೇರದಂತೆ ಉಳಿಸಿ.",
    whatIsIt: "ಇದು ಏನು?", vintageLampPlaceholder: "ಉದಾ. ದೀಪ", pricePlaceholder: "ಬೆಲೆ (ಉಚಿತಕ್ಕಾಗಿ ಖಾಲಿ)",
    address: "ವಿಳಾಸ", addressPlaceholder: "ಉದಾ. ಸೆಕ್ಟರ್ 4",
    pincodeLabel: "ಪಿನ್‌ಕೋಡ್", enterPincode: "ಪಿನ್‌ಕೋಡ್...", search: "ಹುಡುಕು",
    good: "ಉತ್ತಮ", needsRepair: "ದುರಸ್ತಿ", listItemBtn: "ಸೇರಿಸು", selectLanguage: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ",
    vintageChair: "ಹಳೆಯ ಚೇರ್", brokenMonitor: "ಒಡೆದ ಮಾನಿಟರ್",
    usedGood: "ಉತ್ತಮ", scrap: "ಸ್ಕ್ರಾಪ್", likeNew: "ಹೊಸತು", forParts: "ಭಾಗಗಳಿಗಾಗಿ",
    tapToAddPhoto: "ಫೋಟೋ ಸೇರಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
    chats: "ಸಂದೇಶಗಳು", typeMessage: "ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...", send: "ಕಳುಹಿಸು",
    directory: "ಸ್ಥಳೀಯ ಗುಜರಿ ವ್ಯಾಪಾರಿಗಳು", callNow: "ಕರೆ ಮಾಡಿ", rating: "ರೇಟಿಂಗ್",
    activeScrapBatches: "ಈ ವಲಯದಲ್ಲಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾಗುತ್ತಿದೆ."
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const t = (key) => translations[lang][key] || translations['en'][key];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, availableLangs: Object.keys(translations), translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);