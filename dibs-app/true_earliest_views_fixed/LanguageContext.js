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
    whatIsIt: "यह क्या है?", vintageLampPlaceholder: "जैस
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