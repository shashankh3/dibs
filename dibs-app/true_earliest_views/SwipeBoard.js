import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import Card from './Card';
import { useLanguage } from '../LanguageContext';

const DUMMY_DATA = [
  { id: '1', titleKey: 'vintageChair', price: '₹450', distance: '120m', co2: 25, conditionKey: 'usedGood', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800' },
  { id: '2', titleKey: 'brokenMonitor', price: 'Free', distance: '400m', co2: 45, conditionKey: 'scrap', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800' },
  { id: '3', titleKey: 'woodenBookshelf', price: '₹1200', distance: '800m', co2: 30, conditionKey: 'likeNew', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800' },
  { id: '4', titleKey: 'bicycleParts', price: '₹200', distance: '1.2km', co2: 15, conditionKey: 'forParts', image: 'https://images.unsplash.com/photo-1528522306788-51829e248bde?w=800' }
];

export default function SwipeBoard({ onDibs, onRaddi }) {
  const swiperRef = useRef(null);
  const { t } = useLanguage();

  const handleSwipedRight = (cardIndex) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onDibs(DUMMY_DATA[cardIndex].co2);
  };

  const handleSwipedLeft = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  const handleSwipedBottom = () 
          bottom: { title: t('raddi'), style: { label: { backgroundColor: '#F59E0B', color: 'white', fontSize: 24, fontWeight: '900', borderRadius: 10 }, wrapper: { flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', marginTop: 30 } } }
        }}
      />

      <View style={styles.buttonArea}>
        <TouchableOpacity style={[styles.fab, styles.fabPass]} onPress={() => swiperRef.current.swipeLeft()}>
          <Feather name="x" size={28} color="#EF4444" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.fab, styles.fabRaddi]} onPress={() => swiperRef.current.swipeBottom()}>
          <Feather name="trash-2" size={24} color="#F59E0B" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.fab, styles.fabDibs]} onPress={() => swiperRef.current.swipeRight()}>
          <Feather name="check" size={32} color="#10B981" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  buttonArea: { position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20, zIndex: 100, elevation: 100 },
  fab: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#18181B', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  fabPass: { borderColor: '#EF4444', borderWidth: 1 },
  fabRaddi: { width: 50, height: 50, borderColor: '#F59E0B', borderWidth: 1 },
  fabDibs: { width: 70, height: 70, borderRadius: 35, borderColor: '#10B981', borderWidth: 2, backgroundColor: '#064E3B' },
});