import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../LanguageContext';

const { height } = Dimensions.get('window');

export default function Card({ card }) {
  const { t } = useLanguage();

  if (!card) return <View style={styles.placeholder} />;

  return (
    <View style={styles.card}>
      <Image source={{ uri: card.image }} style={styles.image} resizeMode="cover" />
      
      <View style={styles.topTags}>
        <View style={styles.distanceTag}>
          <Feather name="map-pin" size={12} color="#FFF" />
          <Text style={styles.tagText}>{card.distance}</Text>
        </View>
        <View style={styles.co2Tag}>
          <Ionicons name="leaf" size={12} color="#000" />
          <Text style={styles.co2Text}>-{card.co2}kg CO2</Text>
        </View>
      </View>

      <View style={styles.infoOverlay}>
        <View style={styles.infoHeader}>
          <Text style={styles.title}>{t(card.titleKey)}</Text>
          <Text style={styles.price}>{card.price === "Free" ? t('free') : card.price}</Text>
        </View>
        <Text style={styles.condition}>{t('condition')}: {t(card.conditionKey)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: { height: height * 0.60, borderRadius: 24, backgroundColor: 'transparent' },
  card: { 
    height: height * 0.60,
    borderRadius: 24, 
    backgroundColor: '#18181B', 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: '#27272A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  image: { width: '100%', height: '100%', position: 'absolute' },
  topTags: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 20 },
  distanceTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  tagText: { color: '#FFF', fontSize: 12, fontWeight: '600', marginLeft: 4 },
  co2Tag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  co2Text: { color: '#000', fontSize: 12, fontWeight: '900', marginLeft: 4 },
  infoOverlay: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: 'rgba(0,0,0,0.85)' },
  infoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF', flex: 1, marginRight: 10 },
  price: { fontSize: 22, fontWeight: '900', color: '#10B981' },
  condition: { color: '#A1A1AA', fontSize: 14, fontWeight: '500' },
});