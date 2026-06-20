import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';

const MOCK_CHATS = [
  { id: '1', name: 'Harish', item: 'Vintage Office Chair', lastMsg: 'Is the chair still available?', time: '2m ago', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: '2', name: 'Aisha K.', item: 'Wooden Bookshelf', lastMsg: 'I can pick it up tomorrow at 5 PM.', time: '1h ago', avatar: 'https://i.pravatar.cc/150?img=5' }
];

export default function ChatBox() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [activeChat, setActiveChat] = useState(null);
  const [msgInput, setMsgInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 'msg1', text: 'Hey! I saw you called DIBS on my chair.', sender: 'me' },
    { id: 'msg2', text: 'Is the chair still available?', sender: 'them' }
  ]);

  const sendMessage = () => {
    if (msgInput.trim().length === 0) return;
    setMessages([...messages, { id: Math.random().toString(), text: msgInput, sender: 'me' }]);
    setMsgInput('');
  };

  if (activeChat) {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <V
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  chatDetails: { flex: 1, justifyContent: 'center' },
  chatRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  userName: { color: theme.text, fontWeight: 'bold', fontSize: 16 },
  timeText: { color: theme.subText, fontSize: 12 },
  itemText: { color: theme.primary, fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  lastMsgText: { color: theme.subText, fontSize: 14 },
  
  chatHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: theme.card, borderBottomWidth: 1, borderBottomColor: theme.border, gap: 15 },
  chatAvatar: { width: 40, height: 40, borderRadius: 20 },
  chatName: { color: theme.text, fontWeight: 'bold', fontSize: 18 },
  chatItem: { color: theme.primary, fontSize: 12, fontWeight: 'bold' },
  messageList: { flex: 1, padding: 20 },
  messageBubble: { maxWidth: '80%', padding: 14, borderRadius: 20, marginBottom: 10 },
  myMessage: { alignSelf: 'flex-end', backgroundColor: theme.primary, borderBottomRightRadius: 5 },
  theirMessage: { alignSelf: 'flex-start', backgroundColor: theme.border, borderBottomLeftRadius: 5 },
  messageText: { fontSize: 15, lineHeight: 20 },
  inputArea: { flexDirection: 'row', padding: 15, backgroundColor: theme.card, borderTopWidth: 1, borderTopColor: theme.border, gap: 10 },
  input: { flex: 1, backgroundColor: theme.background, color: theme.text, borderRadius: 25, paddingHorizontal: 20, fontSize: 16, borderWidth: 1, borderColor: theme.border },
  sendBtn: { width: 50, height: 50, backgroundColor: theme.primary, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }
});