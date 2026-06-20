import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, Image, Keyboard, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import { collection, query, onSnapshot, doc, setDoc, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function ChatBox({ currentUserId = 'test-user-1' }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [activeChat, setActiveChat] = useState(null);
  const [msgInput, setMsgInput] = useState('');
  
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  // Fetch all chats for the current user
  useEffect(() => {
    const q = query(collection(db, 'chats'));
    const unsub = onSnapshot(q, snapshot => {
      const allChats = snapshot.docs.map(d => d.data());
      // Filter locally since simple 'OR' queries are tricky in Firestore without proper indexing
      const myChats = allChats.filter(c => c.buyerId === currentUserId || c.sellerId === currentUserId);
      // Sort by updatedAt descending so newest chats are at top
      myChats.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      setChats(myChats);
      
      // If the currently open chat was deleted or updated, update its reference
      if (activeChat) {
        const updatedChat = myChats.find(c => c.id === activeChat.id);
        if (!updatedChat) setActiveChat(null); // Chat deleted
      }
    }, err => console.error("Error fetching chats:", err));
    return () => unsub();
  }, [currentUserId]);

  // Fetch messages when a chat is opened
  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      return;
    }
    const q = query(collection(db, `chats/${activeChat.id}/messages`), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, snapshot => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      // Auto scroll to bottom on new message
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, err => console.error("Error fetching messages:", err));
    return () => unsub();
  }, [activeChat]);

  const sendMessage = async () => {
    if (msgInput.trim().length === 0 || !activeChat) return;
    
    const text = msgInput.trim();
    setMsgInput(''); // Clear immediately for UX
    Keyboard.dismiss(); // Dismiss keyboard to prevent jumpiness on submit
    
    try {
      const msgId = Math.random().toString(36).substring(2, 15);
      const messageRef = doc(db, `chats/${activeChat.id}/messages`, msgId);
      
      const msgData = {
        text,
        senderId: currentUserId,
        createdAt: Date.now()
      };
      
      await setDoc(messageRef, msgData);
      
      // Update last message in parent chat document
      const chatRef = doc(db, 'chats', activeChat.id);
      await setDoc(chatRef, {
        lastMessage: text,
        updatedAt: Date.now()
      }, { merge: true });
      
    } catch (e) {
      console.error("Error sending message:", e);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const diff = Math.floor((Date.now() - ts) / 60000); // minutes
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff/60)}h ago`;
    return `${Math.floor(diff/1440)}d ago`;
  };

  const deleteChat = (chatId) => {
    Alert.alert(
      t('deleteChat') || 'Delete Chat',
      t('deleteChatConfirm') || 'Are you sure you want to delete this chat?',
      [
        { text: t('cancel') || 'Cancel', style: 'cancel' },
        { 
          text: t('delete') || 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'chats', chatId));
            } catch (e) {
              console.error("Error deleting chat:", e);
              Alert.alert('Error', 'Could not delete chat.');
            }
          }
        }
      ]
    );
  };

  if (activeChat) {
    // Determine the "other" person's name
    const amIBuyer = activeChat.buyerId === currentUserId;
    const amISeller = activeChat.sellerId === currentUserId;
    const isSelfChat = amIBuyer && amISeller;
    
    let otherName;
    if (isSelfChat) {
      otherName = 'Myself (Seller)';
    } else if (amIBuyer) {
      otherName = activeChat.sellerName || 'Seller';
    } else {
      otherName = activeChat.buyerName || 'Buyer';
    }
    
    const defaultAvatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(otherName || 'User');

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={Platform.OS === 'android' ? 25 : 0}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setActiveChat(null)} style={{ padding: 5 }}>
            <Feather name="chevron-left" size={28} color={theme.text} />
          </TouchableOpacity>
          <Image source={{ uri: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(otherName || 'User') }} style={styles.chatAvatar} />
          <View>
            <Text style={styles.chatName}>{otherName}</Text>
            <Text style={styles.chatItem}>{activeChat.itemTitle}</Text>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          style={styles.messageList}
          contentContainerStyle={{ paddingBottom: 20 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            const isMe = item.senderId === currentUserId;
            return (
              <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
                <Text style={[styles.messageText, isMe ? { color: '#000' } : { color: theme.text }]}>
                  {item.text}
                </Text>
              </View>
            );
          }}
        />

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder={t('typeMessage') || "Type a message..."}
            placeholderTextColor={theme.subText}
            value={msgInput}
            onChangeText={setMsgInput}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Feather name="send" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>{t('chats') || 'Chats'}</Text>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>{t('noChats') || 'No chats yet. Swipe right on items to call DIBS!'}</Text>}
        renderItem={({ item }) => {
          const amIBuyer = item.buyerId === currentUserId;
          const amISeller = item.sellerId === currentUserId;
          const isSelfChat = amIBuyer && amISeller;
          
          let otherName;
          if (isSelfChat) {
            otherName = 'Myself (Seller)';
          } else if (amIBuyer) {
            otherName = item.sellerName || 'Seller';
          } else {
            otherName = item.buyerName || 'Buyer';
          }
          
          const defaultAvatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(otherName || 'User');
          
          return (
            <TouchableOpacity 
              style={styles.chatCard} 
              onPress={() => setActiveChat(item)}
              activeOpacity={0.7}
            >
              <View style={styles.avatarContainer}>
                {/* Large circle is now the Item Image */}
                <Image source={{ uri: item.itemImage || 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=200' }} style={styles.userAvatar} />
                
                {/* Small badge is now the User Avatar */}
                <Image source={{ uri: defaultAvatar }} style={styles.itemBadge} />
              </View>
              <View style={styles.chatDetails}>
                <View style={styles.chatRow}>
                  <Text style={styles.userName}>{otherName}</Text>
                  <Text style={styles.timeText}>{formatTime(item.updatedAt)}</Text>
                </View>
                <Text style={styles.itemText}>{item.itemTitle}</Text>
                <Text style={styles.lastMsgText} numberOfLines={1}>{item.lastMessage}</Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteChatBtn} 
                onPress={() => deleteChat(item.id)}
              >
                <Feather name="trash-2" size={20} color="#EF4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  pageTitle: { color: theme.text, fontSize: 32, fontWeight: '900', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10, letterSpacing: -1 },
  
  // Inbox List Styles
  chatCard: { flexDirection: 'row', padding: 16, paddingHorizontal: 20, backgroundColor: theme.background, borderBottomWidth: 1, borderBottomColor: theme.border },
  avatarContainer: { width: 56, height: 56, marginRight: 16, position: 'relative' },
  userAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: theme.border },
  itemBadge: { position: 'absolute', bottom: -2, right: -4, width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: theme.background, backgroundColor: theme.card },
  chatDetails: { flex: 1, justifyContent: 'center' },
  chatRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  userName: { color: theme.text, fontWeight: 'bold', fontSize: 17, letterSpacing: -0.3 },
  timeText: { color: theme.subText, fontSize: 13, fontWeight: '500' },
  itemText: { color: theme.primary, fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  lastMsgText: { color: theme.subText, fontSize: 15 },
  deleteChatBtn: { padding: 10, justifyContent: 'center', alignItems: 'center' },
  
  // Active Chat Styles
  chatHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: theme.card, borderBottomWidth: 1, borderBottomColor: theme.border, gap: 12 },
  chatAvatar: { width: 44, height: 44, borderRadius: 22 },
  chatName: { color: theme.text, fontWeight: 'bold', fontSize: 18, letterSpacing: -0.5 },
  chatItem: { color: theme.subText, fontSize: 13, fontWeight: '600' },
  
  messageList: { flex: 1, padding: 16 },
  messageBubble: { maxWidth: '75%', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 20, marginBottom: 8 },
  myMessage: { alignSelf: 'flex-end', backgroundColor: theme.primary, borderBottomRightRadius: 4 },
  theirMessage: { alignSelf: 'flex-start', backgroundColor: theme.card, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: theme.border },
  messageText: { fontSize: 16, lineHeight: 22, color: '#111827' },
  
  inputArea: { flexDirection: 'row', padding: 12, paddingHorizontal: 16, backgroundColor: theme.background, borderTopWidth: 1, borderTopColor: theme.border, gap: 12, alignItems: 'center' },
  input: { flex: 1, backgroundColor: theme.card, color: theme.text, borderRadius: 24, paddingHorizontal: 20, height: 48, fontSize: 16, borderWidth: 1, borderColor: theme.border },
  sendBtn: { width: 44, height: 44, backgroundColor: theme.primary, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  
  emptyText: { textAlign: 'center', marginTop: 50, color: theme.subText, paddingHorizontal: 40, fontSize: 16, lineHeight: 24 }
});