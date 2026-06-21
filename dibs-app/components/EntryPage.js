import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import * as Haptics from 'expo-haptics';

const windowDimensions = Dimensions.get('window');
const width = Platform.OS === 'web' ? Math.min(windowDimensions.width, 400) : windowDimensions.width;
const height = Platform.OS === 'web' ? Math.min(windowDimensions.height, 850) : windowDimensions.height;

const slides = [
  {
    id: '1',
    title: "Save the planet.\nFind treasures.",
    subtitle: "Join a community dedicated to a circular economy. Give away what you don't need, and call DIBS on what you do.",
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    icon: 'globe'
  },
  {
    id: '2',
    title: "Swipe to\ncall DIBS.",
    subtitle: "Browse local items instantly. Swipe right to call DIBS and securely chat with the owner to arrange a pickup.",
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800',
    icon: 'layers'
  },
  {
    id: '3',
    title: "Turn trash\ninto cash.",
    subtitle: "Got scrap? Use our live directory to find verified Kabadiwalas near you or schedule a Scrap Route pickup.",
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    icon: 'truck'
  }
];

export default function EntryPage({ onEnter }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    Haptics.selectionAsync();
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current.scrollToOffset({ offset: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }
  };

  const handleEnter = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onEnter();
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ width, flex: 1 }}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.heroImage} />
          <View style={styles.fadeOverlay} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.logoBadge}>
            <Feather name={item.icon} size={20} color={theme.primary} />
            <Text style={styles.logoText}>DIBS</Text>
          </View>
          
          <Text style={styles.headline}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList 
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
      />
      
      {/* Static Footer */}
      <View style={styles.footer}>
        {currentIndex === slides.length - 1 ? (
          <TouchableOpacity style={styles.getStartedBtn} onPress={handleEnter} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Get Started">
            <Text style={styles.btnText}>Get Started</Text>
            <Feather name="arrow-right" size={22} color="#000" />
          </TouchableOpacity>
        ) : (
          <View style={styles.footerControls}>
            <TouchableOpacity onPress={handleEnter} activeOpacity={0.6} style={styles.skipBtn} accessibilityRole="button" accessibilityLabel="Skip introduction">
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <View style={styles.paginationContainer}>
              {slides.map((_, index) => (
                <View 
                  key={index.toString()} 
                  style={[
                    styles.dot, 
                    currentIndex === index ? { backgroundColor: theme.primary, width: 20 } : { backgroundColor: theme.border }
                  ]} 
                />
              ))}
            </View>

            <TouchableOpacity style={styles.iconNextBtn} onPress={handleNext} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Next slide">
              <Feather name="arrow-right" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

function getStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    imageContainer: {
      width: '100%',
      height: height * 0.45,
      position: 'relative',
      backgroundColor: '#000',
    },
    heroImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      opacity: 0.85,
    },
    fadeOverlay: {
      position: 'absolute',
      bottom: -10,
      width: '100%',
      height: 60,
      backgroundColor: theme.background,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      shadowColor: theme.background,
      shadowOffset: { width: 0, height: -20 },
      shadowOpacity: 1,
      shadowRadius: 20,
      elevation: 20,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 30,
      justifyContent: 'center',
      backgroundColor: theme.background,
    },
    logoBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      alignSelf: 'flex-start',
      marginBottom: 24,
    },
    logoText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: '900',
      letterSpacing: 2,
      marginLeft: 8,
    },
    headline: {
      color: theme.text,
      fontSize: 36,
      fontWeight: '900',
      letterSpacing: -1,
      lineHeight: 42,
      marginBottom: 16,
    },
    subtitle: {
      color: theme.subText,
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
    },
    footer: {
      paddingHorizontal: 30,
      paddingBottom: 50,
      backgroundColor: theme.background,
    },
    footerControls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    skipBtn: {
      padding: 10,
      width: 60,
    },
    skipText: {
      color: theme.subText,
      fontSize: 16,
      fontWeight: '600',
    },
    paginationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dot: {
      height: 6,
      width: 6,
      borderRadius: 3,
      marginHorizontal: 4,
    },
    iconNextBtn: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    },
    getStartedBtn: {
      flexDirection: 'row',
      backgroundColor: theme.primary,
      height: 60,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 15,
      elevation: 8,
    },
    btnText: {
      color: '#000',
      fontSize: 20,
      fontWeight: 'bold',
    }
  });
}
