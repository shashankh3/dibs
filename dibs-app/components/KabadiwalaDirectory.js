import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Linking, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';

export default function KabadiwalaDirectory() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  
  const [searchPin, setSearchPin] = useState('');

  const searchOnGoogleMaps = () => {
    const pin = searchPin.trim();
    const query = pin ? `Kabadiwala near ${pin}` : `Kabadiwala near me`;
    // Use the robust Google Maps universal cross-platform search URL schema
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    Linking.openURL(url).catch(err => console.error("Couldn't open Maps", err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>{t('directory') || 'Directory'}</Text>

      <View style={styles.searchContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800' }} 
          style={styles.heroImage} 
        />
        
        <Text style={styles.heroTitle}>Find Live Kabadiwalas</Text>
        <Text style={styles.heroSubtitle}>
          We instantly connect you with verified local scrap dealers directly through Google Maps.
        </Text>

        <View style={styles.searchBar}>
          <Feather name="map-pin" size={18} color={theme.subText} style={{marginLeft: 15}} />
          <TextInput 
            style={styles.searchInput}
            placeholder={t('enterPincode') || 'Enter your Pincode...'}
            placeholderTextColor={theme.subText}
            keyboardType="numeric"
            value={searchPin}
            onChangeText={setSearchPin}
            maxLength={6}
            onSubmitEditing={searchOnGoogleMaps}
            accessibilityLabel="Pincode search input"
            accessibilityHint="Enter your pincode to find local Kabadiwalas"
          />
        </View>

        <TouchableOpacity style={styles.searchBtn} onPress={searchOnGoogleMaps} accessibilityRole="button" accessibilityLabel="Search for Kabadiwalas on Google Maps">
          <Feather name="navigation" size={20} color="#000" />
          <Text style={styles.searchBtnText}>Search on Google Maps</Text>
        </TouchableOpacity>
        
        <View style={styles.infoBox}>
          <Feather name="info" size={16} color={theme.subText} />
          <Text style={styles.infoText}>
            Leaving the pincode empty will automatically search for Kabadiwalas near your current GPS location.
          </Text>
        </View>
      </View>
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  pageTitle: { color: theme.text, fontSize: 28, fontWeight: 'bold', marginHorizontal: 20, marginTop: 20, marginBottom: 10 },
  
  searchContainer: {
    padding: 20,
    alignItems: 'center'
  },
  
  heroImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.border
  },
  
  heroTitle: {
    color: theme.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  
  heroSubtitle: {
    color: theme.subText,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 10,
    lineHeight: 20
  },
  
  searchBar: { 
    width: '100%',
    height: 55, 
    backgroundColor: theme.card, 
    borderRadius: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: theme.border, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 5,
    marginBottom: 20
  },
  
  searchInput: { 
    flex: 1, 
    color: theme.text, 
    paddingHorizontal: 12, 
    fontSize: 16,
    fontWeight: '500'
  },
  
  searchBtn: { 
    width: '100%',
    flexDirection: 'row', 
    backgroundColor: theme.primary, 
    height: 55, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 10, 
    elevation: 4, 
    shadowColor: theme.primary, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8,
    marginBottom: 25
  },
  
  searchBtnText: { 
    color: '#000', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
  
  infoBox: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'flex-start',
    gap: 10
  },
  
  infoText: {
    color: theme.subText,
    fontSize: 13,
    flex: 1,
    lineHeight: 18
  }
});