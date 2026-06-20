import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, Modal, Image, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Feather } from '@expo/vector-icons';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import { getPincodeCoords } from '../utils/locationUtils';
export default function ScrapRoute({ items = [] }) {
  const { t } = useLanguage();
  const { theme, isDarkMode } = useTheme(); // Pull the theme engine
  
  const webViewRef = useRef(null);
  const [searchPin, setSearchPin] = useState('');
  const [activeZone, setActiveZone] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const styles = getStyles(theme);

  const dynamicZones = React.useMemo(() => {
    // Show ALL items on the map so sold items can appear as red markers
    const allItems = items;
    const zones = {};
    allItems.forEach(item => {
      const pin = (item.pincode || '000000').toString().trim();
      const [zoneLat, zoneLng] = getPincodeCoords(pin);

      if (!zones[pin]) {
        zones[pin] = {
          code: pin,
          lat: zoneLat,
          lng: zoneLng,
          weight: 0,
          bounds: [[zoneLat - 0.02, zoneLng - 0.02], [zoneLat + 0.02, zoneLng + 0.02]],
          items: []
        };
      }
      
      const itemHash = item.id ? item.id.charCodeAt(0) : 0;
      const itemLatOffset = (itemHash % 20 - 10) / 5000;
      const itemLngOffset = ((itemHash * 3) % 20 - 10) / 5000;
      
      const itemWeight = 5;
      zones[pin].weight += itemWeight;
      
      zones[pin].items.push({
        ...item,
        lat: item.lat ? item.lat : (zoneLat + itemLatOffset),
        lng: item.lng ? item.lng : (zoneLng + itemLngOffset),
        weight: `${itemWeight}kg`,
        address: item.address || 'Address not provided',
        image: item.image || item.imageUri || 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800'
      });
    });
    return zones;
  }, [items]);

  const allMapItems = React.useMemo(() =>
    Object.values(dynamicZones).flatMap(z => z.items)
  , [dynamicZones]);

  // Inject markers dynamically whenever data changes OR map finishes loading
  const injectMarkers = React.useCallback(() => {
    if (!webViewRef.current) return;
    const script = `
      (function() {
        if (!window.map) return false;
        if (window.markerLayer) window.markerLayer.clearLayers();
        else window.markerLayer = L.layerGroup().addTo(window.map);
        const items = ${JSON.stringify(allMapItems)};
        items.forEach(item => {
          let markerClass = 'marker-available';
          if (item.status === 'raddi') markerClass = 'marker-raddi';
          if (item.status === 'sold') markerClass = 'marker-sold';
          const icon = L.divIcon({ className: 'custom-marker ' + markerClass, iconSize: [20, 20] });
          const marker = L.marker([item.lat, item.lng], { icon });
          marker.on('click', () => window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MARKER_CLICK', id: item.id })));
          window.markerLayer.addLayer(marker);
        });
        return true;
      })();
      true;
    `;
    webViewRef.current.injectJavaScript(script);
  }, [allMapItems]);

  React.useEffect(() => {
    if (mapLoaded) injectMarkers();
  }, [allMapItems, mapLoaded]);

  const handleSearch = () => {
    Keyboard.dismiss();
    const zone = dynamicZones[searchPin.trim()];
    if (zone && webViewRef.current) {
      setActiveZone(zone);
      const script = `
        if (window.map) {
          if (window.activeCircle) {
            window.map.removeLayer(window.activeCircle);
          }
          window.map.fitBounds(${JSON.stringify(zone.bounds)});
          window.activeCircle = L.circle([${zone.lat}, ${zone.lng}], { radius: 1000, color: '#10B981', fillColor: '#10B981', fillOpacity: 0.2 }).addTo(window.map);
        }
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    } else {
      Alert.alert("Not Found", "No items found in this pincode.");
      setActiveZone(null);
    }
  };

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'MARKER_CLICK') {
        const zone = Object.values(dynamicZones).find(z => z.items.some(i => i.id === data.id));
        if (zone) {
          const item = zone.items.find(i => i.id === data.id);
          setSelectedItem(item);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { padding: 0; margin: 0; background-color: ${theme.background}; }
          #map { width: 100vw; height: 100vh; }
          .custom-marker { border: 2px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.5); }
          .marker-available { background: #10B981; } /* Green */
          .marker-raddi { background: #F59E0B; } /* Yellow */
          .marker-sold { background: #EF4444; } /* Red */
          ${theme.mapTiles === 'dark_all' ? `
          .leaflet-tile-pane {
            filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
          }
          ` : ''}
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', { zoomControl: false }).setView([22.5, 78.5], 5);
          // Using Google Maps tiles with &gl=IN flag to enforce official Indian political borders
          L.tileLayer('https://mt1.google.com/vt/lyrs=m&gl=IN&x={x}&y={y}&z={z}', {
            attribution: '© Google Maps',
            maxZoom: 20
          }).addTo(map);

          const items = [];
          // Items are injected dynamically via injectJavaScript after map loads
          window.map = map;
          window.markerLayer = L.layerGroup().addTo(map);
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchBar}>
        <Feather name="search" size={20} color={theme.subText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('enterPincode') || 'Enter Pincode'}
          placeholderTextColor={theme.subText}
          keyboardType="numeric"
          value={searchPin}
          onChangeText={setSearchPin}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>{t('search') || 'Search'}</Text>
        </TouchableOpacity>
      </View>

      <WebView
        ref={webViewRef}
        source={{ html: mapHtml }}
        style={styles.webview}
        onMessage={handleMessage}
        scrollEnabled={false}
        onLoadEnd={() => { setMapLoaded(true); injectMarkers(); }}
      />

      {activeZone && (
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={16} color={theme.primary} />
            <Text style={styles.infoTitle}>{t('zone') || 'Zone'} {activeZone.code}</Text>
          </View>
          <Text style={styles.infoDetails}>
            {t('totalScrapWeight') || 'Total Scrap Weight'}: <Text style={styles.highlightText}>{activeZone.weight}kg</Text>
          </Text>
        </View>
      )}

      <Modal visible={!!selectedItem} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          {selectedItem && (
            <View style={styles.modalCard}>
              <Image source={{ uri: selectedItem.image }} style={styles.modalImage} />
              <View style={styles.modalInfoArea}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Text style={styles.modalTitle}>{t(selectedItem.titleKey || selectedItem.title) || selectedItem.title || 'Item'}</Text>
                  <View style={styles.weightBadge}>
                    <Text style={styles.weightText}>{selectedItem.weight}</Text>
                  </View>
                </View>
                
                <View style={styles.addressRow}>
                  <Feather name="map-pin" size={16} color={theme.subText} style={{ marginTop: 2 }} />
                  <Text style={styles.modalAddress}>{selectedItem.address}</Text>
                </View>

                <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedItem(null)}>
                  <Text style={styles.closeBtnText}>{t('close') || 'Close'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, margin: 20, borderRadius: 25, height: 50, borderWidth: 1, borderColor: theme.border, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  searchIcon: { marginLeft: 15, marginRight: 10 },
  searchInput: { flex: 1, color: theme.text, fontSize: 16 },
  searchButton: { backgroundColor: theme.primary, paddingHorizontal: 20, height: '100%', justifyContent: 'center', borderTopRightRadius: 25, borderBottomRightRadius: 25 },
  searchButtonText: { color: '#000', fontWeight: 'bold' },
  webview: { flex: 1, backgroundColor: theme.background },
  infoBox: { backgroundColor: theme.card, marginHorizontal: 20, marginBottom: 20, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: theme.border, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  infoTitle: { color: theme.text, fontWeight: 'bold', fontSize: 16 },
  infoDetails: { color: theme.subText, fontSize: 13, lineHeight: 18 },
  highlightText: { color: theme.primary, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: theme.overlay, justifyContent: 'flex-end' },
  modalCard: { backgroundColor: theme.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: theme.border, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10 },
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