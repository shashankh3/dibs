import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, LogBox, Modal, FlatList, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Feather, Ionicons } from '@expo/vector-icons';
import SwipeBoard from './components/SwipeBoard';
import AddItem from './components/AddItem';
import ScrapRoute from './components/ScrapRoute';
import ChatBox from './components/ChatBox';
import KabadiwalaDirectory from './components/KabadiwalaDirectory';
import MyListings from './components/MyListings';
import Leaderboard from './components/Leaderboard';
import EntryPage from './components/EntryPage';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { ThemeProvider, useTheme } from './ThemeContext'; // Import our new Theme Engine
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc, increment, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebaseConfig';

LogBox.ignoreAllLogs(true);

function AppContent() {
  const [activeTab, setActiveTab] = useState('swipe');
  const [hasEnteredApp, setHasEnteredApp] = useState(false);
  const [items, setItems] = useState([]);
  const [userScore, setUserScore] = useState({ items: 0, co2: 0, raddi: 0 });
  const [swipedIds, setSwipedIds] = useState(new Set());
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(5);
  const [showLangModal, setShowLangModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const { lang, setLang, t, availableLangs, translations } = useLanguage();
  const { isDarkMode, toggleTheme, theme } = useTheme(); // Pull the active theme

  // Generate styles dynamically based on the current theme
  const styles = getStyles(theme);

  useEffect(() => {
    const q = query(collection(db, 'items'));
    const unsub = onSnapshot(q, snapshot => {
      const dbItems = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));

      // We previously filtered out items without images, but the user wants to see their existing test items.
      const validItems = dbItems;

      console.log("Fetched valid items from Firebase:", validItems.length);
      // Sort so newest items appear first
      setItems(validItems.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    });
    
    // Fetch persistent user state
    const unsubUser = onSnapshot(doc(db, 'users', 'test-user-1'), docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.score) setUserScore(data.score);
        if (data.swipedIds) setSwipedIds(new Set(data.swipedIds));
      }
    });

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      try {
        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setUserLocation({ lat: location.coords.latitude, lng: location.coords.longitude });
      } catch (e) {
        console.log('Could not get location:', e);
      }
    })();

    return () => {
      unsub();
      unsubUser();
    };
  }, []);

  const handleDibs = async (item) => {
    if (!item || !item.id) return;
    setNotification({
      title: "Dibs Confirmed",
      message: `You just called DIBS on ${item.title || 'this item'}!`
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setNotification(null), 3000);

    try {
      const itemRef = doc(db, 'items', item.id);
      await updateDoc(itemRef, { dibsCount: increment(1) });

      const userRef = doc(db, 'users', 'test-user-1');
      await updateDoc(userRef, {
        'score.items': increment(1),
        'score.co2': increment(item.co2 || 0),
        swipedIds: arrayUnion(item.id)
      });

      const buyerId = 'test-user-1';
      const sellerId = item.userId || 'unknown-seller';
      const chatId = `${item.id}_${buyerId}`;
      const chatRef = doc(db, 'chats', chatId);
      await setDoc(chatRef, {
        id: chatId,
        itemId: item.id,
        itemTitle: item.title,
        itemImage: item.image || item.imageUri || 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800',
        buyerId,
        sellerId,
        buyerName: 'Buyer',
        sellerName: 'Seller',
        lastMessage: 'Hey! I just called DIBS on your item.',
        updatedAt: Date.now()
      }, { merge: true });

      const messageRef = doc(collection(db, `chats/${chatId}/messages`));
      await setDoc(messageRef, {
        text: 'Hey! I just called DIBS on your item.',
        senderId: buyerId,
        createdAt: Date.now()
      });
    } catch (e) {
      console.error("Error incrementing dibsCount or creating chat: ", e);
    }
  };

  const handleRaddi = async (item) => {
    if (!item || !item.id) return;
    setNotification({
      title: "Raddi Match",
      message: "Local Kabadiwala is interested in this scrap!"
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setNotification(null), 3000);

    try {
      const itemRef = doc(db, 'items', item.id);
      await updateDoc(itemRef, { status: 'raddi' });

      const userRef = doc(db, 'users', 'test-user-1');
      await updateDoc(userRef, {
        'score.raddi': increment(5),
        swipedIds: arrayUnion(item.id)
      });
    } catch (e) {
      console.error("Error updating document to raddi: ", e);
    }
  };

  const handlePass = async (item) => {
    if (!item || !item.id) return;
    try {
      const userRef = doc(db, 'users', 'test-user-1');
      await updateDoc(userRef, {
        swipedIds: arrayUnion(item.id)
      });
    } catch (e) {
      console.error("Error handling pass: ", e);
    }
  };

  const handleResetSwipes = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const userRef = doc(db, 'users', 'test-user-1');
      await updateDoc(userRef, { 
        swipedIds: [],
        score: { items: 0, co2: 0, raddi: 0 }
      });
    } catch (e) {
      console.error("Error resetting swipes: ", e);
    }
  };

  const handleAddItem = async (newItem) => {
    try {
      // Remove local ID, let Firestore generate it
      const { id, ...itemData } = newItem;
      await addDoc(collection(db, 'items'), { ...itemData, createdAt: Date.now() });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'items', id));
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  const handleMarkSold = async (id) => {
    try {
      await updateDoc(doc(db, 'items', id), { status: 'sold' });
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const switchTab = (tab) => {
    Haptics.selectionAsync();
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'swipe': return <SwipeBoard items={items} swipedIds={swipedIds} userLocation={userLocation} onDibs={handleDibs} onRaddi={handleRaddi} onPass={handlePass} onReset={handleResetSwipes} />;
      case 'add': return <AddItem onAddSuccess={() => setActiveTab('swipe')} onAddItem={handleAddItem} />;
      case 'listings': return <MyListings items={items} onRemoveItem={handleRemoveItem} onMarkSold={handleMarkSold} />;
      case 'scrap': return <ScrapRoute items={items} />;
      case 'chats': return <ChatBox currentUserId="test-user-1" />;
      case 'directory': return <KabadiwalaDirectory />;
      case 'leaderboard': return <Leaderboard />;
      default: return <SwipeBoard items={items} swipedIds={swipedIds} userLocation={userLocation} onDibs={handleDibs} onRaddi={handleRaddi} onPass={handlePass} onReset={handleResetSwipes} />;
    }
  };

  if (!hasEnteredApp) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        <EntryPage onEnter={() => setHasEnteredApp(true)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoContainer} onPress={() => setActiveTab('leaderboard')} activeOpacity={0.7}>
          <Text style={styles.logoText}>dibs</Text>
          <View style={styles.logoDot} />
          {userScore.co2 > 0 && (
            <Text style={styles.co2Text}>{userScore.co2}kg saved</Text>
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={styles.headerBtn} onPress={toggleTheme}>
            <Feather name={isDarkMode ? "sun" : "moon"} size={20} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setShowLangModal(true)}>
            <Feather name="globe" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sub Header (Tabs) */}
      <View style={styles.subHeader}>
        <View style={styles.tabContainer}>
          {['swipe', 'add', 'listings', 'scrap', 'chats', 'directory'].map(tab => (
            <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => switchTab(tab)} activeOpacity={0.7}>
              <Feather name={
                tab === 'swipe' ? 'layers' :
                  tab === 'add' ? 'plus-square' :
                    tab === 'listings' ? 'list' :
                      tab === 'scrap' ? 'truck' :
                        tab === 'chats' ? 'message-circle' : 'book'
              } size={22} color={activeTab === tab ? theme.primary : theme.subText} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Inline Notification overlays the tab container perfectly */}
        {notification && (
          <View style={styles.notificationBanner}>
            <View style={styles.notifIconContainer}>
              <Ionicons name="leaf" size={16} color="#000" />
            </View>
            <View style={styles.notifTextContainer}>
              <Text style={styles.notifTitle} numberOfLines={1}>{notification.title}</Text>
              <Text style={styles.notifMessage} numberOfLines={1}>{notification.message}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Language Modal */}
      <Modal visible={showLangModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('selectLanguage') || 'Select Language'}</Text>
            <FlatList
              data={availableLangs}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.langOption, lang === item && styles.langOptionActive]}
                  onPress={() => { setLang(item); setShowLangModal(false); }}
                >
                  <Text style={[styles.langOptionText, lang === item && { color: '#000' }]}>
                    {translations[item]?.langName || item.toUpperCase()}
                  </Text>
                  {lang === item && <Feather name="check-circle" size={20} color="#000" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <LanguageProvider>
          <SafeAreaProvider>
            <AppContent />
          </SafeAreaProvider>
        </LanguageProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.background,
    ...Platform.select({
      web: {
        maxWidth: 600,
        width: '100%',
        marginHorizontal: 'auto',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: theme.border,
        boxShadow: '0 0 20px rgba(0,0,0,0.1)'
      },
      default: {}
    })
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  headerBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.card, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },

  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoText: { fontSize: 34, fontWeight: '900', color: theme.text, letterSpacing: -1.5 },
  logoDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.primary, marginBottom: 2, marginLeft: 2 },
  co2Text: { color: theme.subText, fontSize: 13, fontWeight: '700', marginLeft: 10, letterSpacing: -0.3 },

  subHeader: { paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: theme.border },
  tabContainer: { flexDirection: 'row', backgroundColor: theme.card, borderRadius: 24, padding: 6, borderWidth: 1, borderColor: theme.border, justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 },
  tab: { flex: 1, paddingVertical: 12, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  activeTab: { backgroundColor: 'rgba(16, 185, 129, 0.1)' },

  content: { flex: 1 },

  notificationBanner: { position: 'absolute', top: 0, left: 20, right: 20, bottom: 15, backgroundColor: theme.primary, borderRadius: 20, zIndex: 1000, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, shadowColor: theme.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  notifIconContainer: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  notifTextContainer: { flex: 1, justifyContent: 'center' },
  notifTitle: { color: '#000', fontWeight: '800', fontSize: 14, letterSpacing: -0.3 },
  notifMessage: { color: 'rgba(0,0,0,0.6)', fontSize: 12, fontWeight: '600', letterSpacing: -0.1, marginTop: 1 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 400, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 },
  modalTitle: { color: theme.text, fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  langOption: { paddingHorizontal: 20, paddingVertical: 16, borderRadius: 12, marginBottom: 10, backgroundColor: theme.background, borderWidth: 1, borderColor: theme.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  langOptionActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  langOptionText: { color: theme.text, fontSize: 16, fontWeight: '600' }
});