import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, Modal, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import { Feather } from '@expo/vector-icons';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';

const ZONES = {
  "491441": {
    code: "491441", lat: 21.1015, lng: 81.0297, weight: 85,
    bounds: [[21.085, 81.015], [21.115, 81.045]],
    items: [
      { id: 'm1', titleKey: 'brokenMonitor', weight: '15kg', address: 'Sector 3, Housing Board Colony', lat: 21.1045, lng: 81.0325, image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800' },
      { id: 'm2', titleKey: 'vintageChair', weight: '8kg', address: 'Ganj Para, Near Railway Station', lat: 21.0985, lng: 81.0375, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800' }
    ]
  },
  "491444": {
    code: "491444", lat: 21.0825, lng: 81.0110, weight: 24,
    bounds: [[21.070, 80.995], [21.090, 81.025]],
    items: [
      { id: 'm4', titleKey: 'ironPipes', weight: '24kg', address: 'Industrial Area, Singhola', lat: 21.0825, lng: 81.0110, image: 'https://images.unsplash.com/photo-1528522306788-51829e248bde?w=800' }
    ]
  }
};

export default function ScrapRoute({ radius }) {
  const { t } = useLanguage();
  const { theme, isDarkMode } = useTheme(); // Pull the theme engine
  
  const webViewRef = useRef(null);
  searchButton: { backgroundColor: theme.primary, paddingHorizontal: 20, height: '100%', justifyContent: 'center', borderTopRightRadius: 25, borderBottomRightRadius: 25 },
  searchButtonText: { color: '#000', fontWeight: 'bold' },
  webview: { flex: 1, backgroundColor: theme.background },
  infoBox: { backgroundColor: theme.card, marginHorizontal: 20, marginBottom: 20, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: theme.border },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  infoTitle: { color: theme.text, fontWeight: 'bold', fontSize: 16 },
  infoDetails: { color: theme.subText, fontSize: 13, lineHeight: 18 },
  highlightText: { color: theme.primary, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: theme.overlay, justifyContent: 'flex-end' },
  modalCard: { backgroundColor: theme.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: theme.border },
  modalImage: { width: '100%', height: 240 },
  modalInfoArea: { padding: 20, paddingBottom: 30 },
  modalTitle: { color: theme.text, fontSize: 22, fontWeight: 'bold', flex: 1, marginRight: 10 },
  weightBadge: { backgroundColor: theme.warning, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  weightText: { color: '#000', fontWeight: 'bold', fontSize: 12 },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 14, padding: 12, backgroundColor: theme.background, borderRadius: 12, borderWidth: 1, borderColor: theme.border },
  modalAddress: { color: theme.subText, fontSize: 14, marginLeft: 8, flex: 1, lineHeight: 20 },
  closeBtn: { marginTop: 20, backgroundColor: theme.border, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  closeBtnText: { color: theme.text, fontWeight: 'bold', fontSize: 16 }
});