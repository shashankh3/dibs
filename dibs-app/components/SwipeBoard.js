import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Image, Platform } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import Card from './Card';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import { getPincodeCoords, getDistanceKm } from '../utils/locationUtils';

const windowDimensions = Dimensions.get('window');
const width = Platform.OS === 'web' ? Math.min(windowDimensions.width, 400) : windowDimensions.width;
const height = Platform.OS === 'web' ? Math.min(windowDimensions.height, 850) : windowDimensions.height;
const SWIPE_THRESHOLD = width * 0.3;
const SWIPE_OUT_DURATION = 250;


function getStyles(theme) {
  return StyleSheet.create({
    container: { flex: 1 },
    deckContainer: { flex: 1, marginTop: -75, alignItems: 'center', justifyContent: 'center' },
    buttonPillContainer: { 
      position: 'absolute', 
      bottom: 20, 
      alignSelf: 'center', 
      flexDirection: 'row', 
      alignItems: 'center', 
      backgroundColor: theme.card, 
      borderRadius: 40, 
      paddingHorizontal: 10, 
      paddingVertical: 5, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 10 }, 
      shadowOpacity: 0.15, 
      shadowRadius: 20, 
      elevation: 100,
      zIndex: 100,
      borderWidth: 1,
      borderColor: theme.border,
    },
    pillButton: { width: 65, height: 65, justifyContent: 'center', alignItems: 'center' },
    pillDivider: { width: 1, height: 30, backgroundColor: theme.border, opacity: 0.5 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -50 },
    emptyText: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  });
}

export default function SwipeBoard({ items = [], swipedIds = new Set(), userLocation, onDibs, onRaddi, onPass, onReset }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const locallySwipedIds = useRef(new Set());
  const [trigger, setTrigger] = useState(0);

  const initialCards = useMemo(() => {
    let liveItems = items.filter(item => {
      const s = (item.status || 'available').toLowerCase();
      if (s === 'sold' || s === 'raddi') return false;
      if (swipedIds.has(item.id)) return false;
      if (locallySwipedIds.current.has(item.id)) return false;
      return true;
    });

    if (userLocation) {
      liveItems = liveItems.map(item => {
        let itemLat = item.lat;
        let itemLng = item.lng;
        if (!itemLat || !itemLng) {
          const coords = getPincodeCoords(item.pincode);
          itemLat = coords[0];
          itemLng = coords[1];
        }
        
        const distKm = getDistanceKm(userLocation.lat, userLocation.lng, itemLat, itemLng);
        return {
          ...item,
          calculatedDistance: distKm < 1 ? `${Math.round(distKm * 1000)}m` : `${distKm.toFixed(1)}km`,
          _distVal: distKm
        };
      });

      liveItems.sort((a, b) => a._distVal - b._distVal);
    }

    return liveItems;
  }, [items, swipedIds, userLocation, trigger]);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    const urlsToPrefetch = initialCards
      .slice(1, 4)
      .map(card => card.image || card.imageUri)
      .filter(uri => uri && !uri.startsWith('data:image'));
      
    urlsToPrefetch.forEach(uri => {
      Image.prefetch(uri).catch(() => {});
    });
  }, [initialCards]);

  const onSwipeComplete = useCallback((direction) => {
    const item = initialCards[0];
    if (!item) return;

    if (direction === 'right' && onDibs) onDibs(item);
    else if (direction === 'bottom' && onRaddi) onRaddi(item);
    else if (direction === 'left') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (onPass) onPass(item);
    }
    
    locallySwipedIds.current.add(item.id);
    translateX.value = 0;
    translateY.value = 0;
    setTrigger(t => t + 1);
  }, [initialCards, onDibs, onRaddi, onPass, translateX, translateY]);

  const forceSwipe = useCallback((direction) => {
    let toX = 0, toY = 0;
    if (direction === 'right') toX = width * 1.5;
    if (direction === 'left') toX = -width * 1.5;
    if (direction === 'bottom') toY = height * 1.5;
    
    translateX.value = withTiming(toX, { duration: SWIPE_OUT_DURATION });
    translateY.value = withTiming(toY, { duration: SWIPE_OUT_DURATION }, (finished) => {
      if (finished) runOnJS(onSwipeComplete)(direction);
    });
  }, [onSwipeComplete, translateX, translateY]);

  const panGesture = useMemo(() => Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY < -50 && Math.abs(e.translationX) < 50) return;
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationX > SWIPE_THRESHOLD) {
        runOnJS(forceSwipe)('right');
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        runOnJS(forceSwipe)('left');
      } else if (e.translationY > SWIPE_THRESHOLD && Math.abs(e.translationX) < SWIPE_THRESHOLD) {
        runOnJS(forceSwipe)('bottom');
      } else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    }),
  [forceSwipe, translateX, translateY]);

  const cardTree = useMemo(() => {
    if (initialCards.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Feather name="refresh-cw" size={50} color={theme.subText} />
          <Text style={[styles.emptyText, { color: theme.subText, marginBottom: 20 }]}>
            {t('noMoreItems') || "You've seen everything!"}
          </Text>
          {onReset && (
            <TouchableOpacity 
              style={{ backgroundColor: theme.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25, flexDirection: 'row', alignItems: 'center', gap: 8 }}
              onPress={() => {
                locallySwipedIds.current.clear();
                setTrigger(t => t + 1);
                onReset();
              }}
            >
              <Feather name="rotate-ccw" size={18} color="#000" />
              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>Refresh Deck</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    const cardsToRender = initialCards.slice(0, 3);

    return cardsToRender.map((card, depth) => {
      return (
        <View
          key={card.id}
          style={[StyleSheet.absoluteFillObject, { zIndex: 100 - depth, alignItems: 'center', justifyContent: 'center' }]}
          pointerEvents={depth === 0 ? 'auto' : 'none'}
        >
          {depth === 0 ? (
            <GestureDetector gesture={panGesture}>
              <Card
                data={card}
                depth={0}
                translateX={translateX}
                translateY={translateY}
                primaryColor={theme.primary}
                cardBg={theme.card}
              />
            </GestureDetector>
          ) : (
            <Card
              data={card}
              depth={depth}
              translateX={translateX}
              translateY={translateY}
              primaryColor={theme.primary}
              cardBg={theme.card}
            />
          )}
        </View>
      );
    }).reverse();
  }, [initialCards, panGesture, theme, translateX, translateY, t, styles, onReset]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.deckContainer}>
        {cardTree}
      </View>
      <View style={styles.buttonPillContainer}>
        <TouchableOpacity style={styles.pillButton} onPress={() => forceSwipe('left')} activeOpacity={0.6}>
          <Feather name="x" size={26} color="#EF4444" />
        </TouchableOpacity>
        <View style={styles.pillDivider} />
        <TouchableOpacity style={styles.pillButton} onPress={() => forceSwipe('bottom')} activeOpacity={0.6}>
          <Feather name="trash-2" size={22} color={theme.subText} />
        </TouchableOpacity>
        <View style={styles.pillDivider} />
        <TouchableOpacity style={styles.pillButton} onPress={() => forceSwipe('right')} activeOpacity={0.6}>
          <Feather name="heart" size={26} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}