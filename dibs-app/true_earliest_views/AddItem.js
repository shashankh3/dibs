import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';

export default function AddItem({ onAddSuccess }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  
  const { t } = useLanguage();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleSubmit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onAddSuccess();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.headerTitle}>{t('listAnItem')}</Text>
        <Text style={styles.subText}>{t('saveItemsLandfill')}</Text>

        <TouchableOpacity style={styles.photoUpload} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
          <Feather name="camera" size={40} color={theme.subText} />
          <Text style={styles.photoText}>{t('tapToAddPhoto')}</Text>
        </TouchableOpacity>

   
  container: { flex: 1, backgroundColor: theme.background },
  scrollContent: { padding: 20, paddingBottom: 40 },
  headerTitle: { color: theme.text, fontSize: 28, fontWeight: '900', marginBottom: 5 },
  subText: { color: theme.subText, fontSize: 14, marginBottom: 24 },
  photoUpload: { height: 200, backgroundColor: theme.card, borderRadius: 16, borderWidth: 2, borderColor: theme.border, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  photoText: { color: theme.subText, marginTop: 10, fontWeight: '600' },
  form: { gap: 15 },
  label: { color: theme.text, fontWeight: 'bold', fontSize: 16, marginTop: 10 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, borderRadius: 12, paddingHorizontal: 15, height: 55, borderWidth: 1, borderColor: theme.border },
  input: { flex: 1, color: theme.text, fontSize: 16 },
  conditionRow: { flexDirection: 'row', gap: 8 },
  conditionBtn: { flex: 1, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, paddingVertical: 12, paddingHorizontal: 5, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  conditionBtnActive: { flex: 1, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderWidth: 1, borderColor: theme.primary, paddingVertical: 12, paddingHorizontal: 5, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  conditionBtnText: { color: theme.subText, fontWeight: '600', fontSize: 13, textAlign: 'center' },
  conditionBtnTextActive: { color: theme.primary, fontWeight: 'bold', fontSize: 13, textAlign: 'center' },
  submitButton: { flexDirection: 'row', backgroundColor: theme.primary, height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 40, gap: 10 },
  submitButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold' }
});