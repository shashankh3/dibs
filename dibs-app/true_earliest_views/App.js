import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, LogBox, Modal, FlatList } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import SwipeBoard from './components/SwipeBoard';
import AddItem from './components/AddItem';
import ScrapRoute from './components/ScrapRoute';
import ChatBox from './components/ChatBox';
import KabadiwalaDirectory from './components/KabadiwalaDirectory';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { ThemeProvider, useTheme } from './ThemeContext'; // Import our new Theme Engine
import * as Haptics from 'expo-haptics';

LogBox.ignoreAllLogs(true);

function AppContent() {
  const [activeTab, setActiveTab] = useState('swipe');
  const [userScore, setUserScore] = useState({ items: 0, co2: 0, raddi: 0 });
  const [radius, setRadius] = useState(5);
  const [showLangModal, setShowLangModal] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const { lang, setLang, t, availableLangs, translations } = useLanguage();
  const { isDarkMode, toggleTheme, theme } = useTheme(); // Pull the active theme
  
  // Generate styles dynamically based on the current theme
  const styles = getStyles(theme);

  const handleDibs = (co2Value) => {
    setUserScore(prev => ({ ...prev, items: prev.items + 1, co2: prev.co2 + co2Value }));
    setNotification("🔔 Harish just called
  headerBtnText: { color: theme.text, fontSize: 12, fontWeight: 'bold' },
  
  radiusControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: theme.border },
  radiusText: { color: theme.text, fontWeight: 'bold', marginHorizontal: 10, fontSize: 14, width: 40, textAlign: 'center' },
  
  subHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: theme.border },
  tabContainer: { flexDirection: 'row', backgroundColor: theme.card, borderRadius: 20, padding: 4, gap: 2, borderWidth: 1, borderColor: theme.border },
  tab: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 16 },
  activeTab: { backgroundColor: theme.border },
  
  statsContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  scoreText: { color: '#FFF', fontWeight: 'bold', marginLeft: 4, fontSize: 16 },
  content: { flex: 1 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 400 },
  modalTitle: { color: theme.text, fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  langOption: { padding: 16, borderRadius: 12, marginBottom: 10, backgroundColor: theme.background, borderWidth: 1, borderColor: theme.border, alignItems: 'center' },
  langOptionActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  langOptionText: { color: theme.text, fontSize: 16, fontWeight: '600' }
});