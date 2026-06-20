import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';

const MOCK_PROFILES = [
  { id: '1', name: 'Raju Scrap Merchants', pincode: '491441', rating: '4.8', phone: '+91 98765 43210', type: 'General Raddi, E-Waste' },
  { id: '2', name: 'Green Earth Recyclers', pincode: '491441', rating: '4.9', phone: '+91 87654 32109', type: 'Metal, Plastic, Heavy' },
  { id: '3', name: 'Singhola Kabadi Hub', pincode: '491444', rating: '4.5', phone: '+91 76543 21098', type: 'Industrial Scrap, Iron' }
];

export default function KabadiwalaDirectory() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  
  const [searchPin, setSearchPin] = useState('');

  const filteredProfiles = searchPin.trim() 
    ? MOCK_PROFILES.filter(p => p.pincode.includes(searchPin.trim()))
    : MOCK_PROFILES;

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>{t('directory')}</Text>

      <View style={styles.searchBar}>
        <Feather name="search" size={18} color={theme.subText} style={{marginLeft: 10}} />
        <TextInput 
          style={styles.searchInput}
          placeholder={t('enterPincode')}
          placeholderTextColor={theme.subText}
      
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  pageTitle: { color: theme.text, fontSize: 24, fontWeight: 'bold', marginHorizontal: 20, marginTop: 20, marginBottom: 10 },
  
  searchBar: { marginHorizontal: 20, marginBottom: 10, height: 50, backgroundColor: theme.card, borderRadius: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: theme.border },
  searchInput: { flex: 1, color: theme.text, paddingHorizontal: 12, fontSize: 15 },
  
  profileCard: { backgroundColor: theme.card, borderRadius: 16, padding: 16, marginBottom: 15, borderWidth: 1, borderColor: theme.border },
  profileHeader: { flexDirection: 'row', marginBottom: 15 },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: theme.border, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: theme.primary, fontSize: 24, fontWeight: '900' },
  infoCol: { flex: 1, justifyContent: 'center' },
  nameText: { color: theme.text, fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  typeText: { color: theme.subText, fontSize: 13, marginBottom: 8 },
  statsRow: { flexDirection: 'row', gap: 10 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: theme.border, gap: 4 },
  badgeText: { color: theme.text, fontSize: 12, fontWeight: 'bold' },
  
  callBtn: { flexDirection: 'row', backgroundColor: theme.primary, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 8 },
  callBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});