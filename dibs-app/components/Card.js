import React, { memo, useMemo, forwardRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import { Feather, Ionicons } from '@expo/vector-icons';
import FastImage from 'expo-fast-image';
import { useLanguage } from '../LanguageContext';

const windowDimensions = Dimensions.get('window');
const width = Platform.OS === 'web' ? Math.min(windowDimensions.width, 400) : windowDimensions.width;
const height = Platform.OS === 'web' ? Math.min(windowDimensions.height, 850) : windowDimensions.height;

const Card = memo(forwardRef(({ data, depth, translateX, translateY, primaryColor, cardBg }, ref) => {
  const { t } = useLanguage();
  const styles = useMemo(() => getStyles(primaryColor, cardBg), [primaryColor, cardBg]);

  const animatedStyle = useAnimatedStyle(() => {
    if (depth === 0) {
      const rotate = interpolate(
        translateX.value,
        [-width / 2, 0, width / 2],
        [-10, 0, 10],
        Extrapolation.CLAMP
      );
      return {
        opacity: 1,
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { rotate: `${rotate}deg` },
        ],
      };
    }

    const baseScale = depth === 1 ? 0.95 : 0.90;
    const targetScale = depth === 1 ? 1 : 0.95;
    const baseY = depth === 1 ? 15 : 30;
    const targetY = depth === 1 ? 0 : 15;

    const scale = interpolate(
      Math.abs(translateX.value),
      [0, width / 2],
      [baseScale, targetScale],
      Extrapolation.CLAMP
    );
    const translateYVal = interpolate(
      Math.abs(translateX.value),
      [0, width / 2],
      [baseY, targetY],
      Extrapolation.CLAMP
    );

    return {
      opacity: 0.99,
      transform: [{ scale }, { translateY: translateYVal }],
    };
  });

  const leftOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-width / 3, 0], [1, 0], Extrapolation.CLAMP)
  }));
  const rightOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, width / 3], [0, 1], Extrapolation.CLAMP)
  }));
  const bottomOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, height / 3], [0, 1], Extrapolation.CLAMP)
  }));

  if (!data) return <View style={styles.placeholder} />;

  const isHot = data.dibsCount >= 10;
  const safeImage = data.image || data.imageUri || 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800';

  return (
    <Animated.View
      ref={ref}
      style={[styles.cardContainer, animatedStyle]}
      renderToHardwareTextureAndroid={true}
      shouldRasterizeIOS={true}
    >
      <View style={styles.card}>
        <FastImage
          source={{
            uri: safeImage,
            priority: FastImage.priority?.high,
            cache: FastImage.cacheControl?.immutable,
          }}
          style={styles.image}
          resizeMode={FastImage.resizeMode?.cover || 'cover'}
        />

        <View style={styles.topRow}>
          <View style={styles.distancePill}>
            <Feather name="map-pin" size={12} color="#D1D5DB" />
            <Text style={styles.distanceText}>{data.calculatedDistance || data.distance}</Text>
          </View>
          {isHot && (
            <View style={styles.hotPill}>
              <Text style={styles.hotEmoji}>🔥</Text>
              <Text style={styles.hotText}>HOT</Text>
            </View>
          )}
        </View>

        <View style={styles.infoOverlay}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{t(data.titleKey) || data.titleKey}</Text>
            <Text style={styles.price}>{data.price === 'Free' ? t('free') : data.price}</Text>
          </View>

          <Text style={styles.condition}>{t('condition')}: {t(data.conditionKey) || data.conditionKey}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Ionicons name="leaf" size={13} color="#10B981" />
              <Text style={styles.statChipText}>Saves {data.co2}kg CO₂</Text>
            </View>

            <View style={[styles.statChip, styles.dibsChip]}>
              <Feather name="users" size={13} color={primaryColor} />
              <Text style={styles.dibsText}>{data.dibsCount} Dibs</Text>
            </View>
          </View>
        </View>
      </View>
      
      {depth === 0 && (
        <>
          <Animated.View style={[styles.overlayLabel, styles.overlayLeft, leftOverlayStyle]}>
            <Text style={styles.overlayTextRed}>{t('pass')}</Text>
          </Animated.View>
          <Animated.View style={[styles.overlayLabel, styles.overlayRight, rightOverlayStyle]}>
            <Text style={styles.overlayTextGreen}>{t('dibs')}</Text>
          </Animated.View>
          <Animated.View style={[styles.overlayLabel, styles.overlayBottom, bottomOverlayStyle]}>
            <Text style={styles.overlayTextOrange}>{t('raddi')}</Text>
          </Animated.View>
        </>
      )}
    </Animated.View>
  );
}));

export default Card;

function getStyles(primaryColor, cardBg) {
  return StyleSheet.create({
    placeholder: { height: height * 0.52, borderRadius: 24, backgroundColor: 'transparent' },
    cardContainer: { position: 'absolute', width: width - 30, height: height * 0.52, alignSelf: 'center' },
    card: { height: '100%', borderRadius: 24, backgroundColor: cardBg, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.25, shadowRadius: 30, elevation: 16 },
    image: { width: '100%', height: '100%', position: 'absolute' },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 20 },
    distancePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, gap: 4 },
    distanceText: { color: '#E5E7EB', fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
    hotPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,59,48,0.85)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, gap: 4, shadowColor: '#FF3B30', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 8 },
    hotEmoji: { fontSize: 13 },
    hotText: { color: '#FFF', fontSize: 12, fontWeight: '900', letterSpacing: 1.2 },
    infoOverlay: { position: 'absolute', bottom: 0, width: '100%', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20, backgroundColor: 'rgba(0,0,0,0.8)', gap: 6 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    title: { fontSize: 22, fontWeight: '800', color: '#FFF', flex: 1, marginRight: 12, letterSpacing: -0.3 },
    price: { fontSize: 20, fontWeight: '900', color: primaryColor, letterSpacing: -0.5 },
    condition: { color: '#9CA3AF', fontSize: 13, fontWeight: '500', marginBottom: 4 },
    statsRow: { flexDirection: 'row', gap: 10, marginTop: 4, flexWrap: 'wrap' },
    statChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    statChipText: { color: '#E5E7EB', fontSize: 13, fontWeight: '600' },
    dibsChip: { backgroundColor: 'rgba(255,59,48,0.1)', borderColor: 'rgba(255,59,48,0.2)' },
    dibsText: { color: primaryColor, fontSize: 13, fontWeight: '800' },
    overlayLabel: { position: 'absolute', zIndex: 1000 },
    overlayLeft: { top: 50, right: 30, transform: [{ rotate: '15deg' }] },
    overlayRight: { top: 50, left: 30, transform: [{ rotate: '-15deg' }] },
    overlayBottom: { top: 100, alignSelf: 'center', transform: [{ rotate: '-5deg' }] },
    overlayTextRed: { backgroundColor: '#EF4444', color: 'white', fontSize: 32, fontWeight: '900', padding: 10, borderRadius: 10, borderWidth: 3, borderColor: '#EF4444', overflow: 'hidden' },
    overlayTextGreen: { backgroundColor: '#10B981', color: 'white', fontSize: 32, fontWeight: '900', padding: 10, borderRadius: 10, borderWidth: 3, borderColor: '#10B981', overflow: 'hidden' },
    overlayTextOrange: { backgroundColor: '#F59E0B', color: 'white', fontSize: 32, fontWeight: '900', padding: 10, borderRadius: 10, borderWidth: 3, borderColor: '#F59E0B', overflow: 'hidden' }
  });
}