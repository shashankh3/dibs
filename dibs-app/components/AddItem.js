import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, Image, Modal, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { WebView } from 'react-native-webview';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';

const Iframe = Platform.OS === 'web' ? React.forwardRef((props, ref) => React.createElement('iframe', { ...props, ref })) : () => null;

export default function AddItem({ onAddSuccess, onAddItem }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [condition, setCondition] = useState('used');
  const [imageUri, setImageUri] = useState(null);
  
  // Map Modal State
  const [showMapModal, setShowMapModal] = useState(false);
  const [tempLat, setTempLat] = useState(22.5);
  const [tempLng, setTempLng] = useState(78.5);
  const [selectedLat, setSelectedLat] = useState(null);
  const [selectedLng, setSelectedLng] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const listener = (event) => {
      // Check if it's our location message format
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && data.lat && data.lng) {
          handleMapMessage({ nativeEvent: { data: event.data } });
        }
      } catch (e) {}
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);
  
  const { t } = useLanguage();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleSubmit = async () => {
    if (!title || !price || !address || !pincode) {
      Alert.alert('Missing Fields', 'Please fill in all the details.');
      return;
    }
    if (!imageUri) {
      Alert.alert('Missing Photo', 'Please take a photo of the item.');
      return;
    }

    const estimateCO2 = (titleStr) => {
      const t = titleStr.toLowerCase();
      
      // Extremely Heavy (50kg - 150kg+): Major appliances & large vehicles
      if (t.match(/(fridge|refrigerator|washing machine|dryer|ac |air conditioner|dishwasher|motorcycle|scooter)/)) return 50 + Math.floor(Math.random() * 50);
      
      // Very Heavy (30kg - 80kg): Large furniture & medium appliances
      if (t.match(/(sofa|couch|bed|mattress|almirah|wardrobe|dining table|dresser|cabinet|oven|treadmill)/)) return 30 + Math.floor(Math.random() * 40);
      
      // Heavy (15kg - 30kg): Medium furniture, e-waste, bicycles
      if (t.match(/(tv|television|desktop|pc|computer|monitor|printer|microwave|vacuum|bicycle|bike|cycle|desk|bookshelf)/)) return 15 + Math.floor(Math.random() * 10);
      
      // Medium (5kg - 15kg): Small furniture, large toys, baby gear
      if (t.match(/(chair|stool|shelf|table|console|playstation|xbox|stroller|car seat|guitar|keyboard instrument|luggage|suitcase|rug|carpet)/)) return 5 + Math.floor(Math.random() * 8);
      
      // Light (2kg - 5kg): Small appliances, IT gear, winter clothes, large kitchenware
      if (t.match(/(laptop|tablet|ipad|blender|mixer|toaster|iron|kettle|coffee maker|fan|heater|lamp|jacket|coat|boot|backpack|pot|pan|blanket)/)) return 2 + Math.floor(Math.random() * 3);
      
      // Very Light (0.5kg - 2kg): General apparel, books, standard kitchenware, toys, phones
      if (t.match(/(phone|smartphone|mobile|book|textbook|novel|shirt|pant|jeans|dress|shoe|sneaker|bag|purse|towel|plate|bowl|cup|glass|utensil|vase|mirror|clock|toy|doll|puzzle|board game|lego)/)) return 0.5 + (Math.random() > 0.5 ? 0.5 : 0);
      
      // Micro (0.1kg - 0.5kg max): Personal care, accessories, micro-electronics
      if (t.match(/(earphone|headphone|tws|earbud|airpod|charger|cable|wire|mouse|keyboard|remote|usb|drive|battery|watch|sunglass|glass|trimmer|shaver|razor|brush|comb|perfume|makeup|pen|pencil|case|cover|wallet|stand|mount|holder)/)) return parseFloat((0.1 + Math.random() * 0.4).toFixed(1));
      
      // Nano (under 100g): Stickers, decals, pins, extremely small objects
      if (t.match(/(sticker|pin|decal|tag|clip|band)/)) return 0.05;
      
      // Default: If we don't recognize it, assume it's a very light household item (0.5kg).
      return 0.5;
    };

    if (onAddItem) {
      onAddItem({
        titleKey: title,
        title: title, 
        price: price ? `₹${price}` : 'Free',
        address: address,
        pincode: pincode,
        lat: selectedLat, // Exact coordinates from map picker
        lng: selectedLng,
        distance: '0km',
        co2: estimateCO2(title),
        conditionKey: condition,
        condition: condition,
        image: imageUri,
        dibsCount: 0,
        status: 'available',
        userId: 'test-user-1'
      });
    }

    Alert.alert("Success", "Your item is listed.");
    setTitle(''); setPrice(''); setAddress(''); setPincode(''); setImageUri(null);
    setSelectedLat(null); setSelectedLng(null);
    if (onAddSuccess) onAddSuccess();
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1, // Compress heavily to fit in Firestore 1MB limit
      base64: true, // Output pure base64 text
    });
    if (!result.canceled) {
      setImageUri(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const confirmLocation = async () => {
    setShowMapModal(false);
    setSelectedLat(tempLat);
    setSelectedLng(tempLng);
    setIsGeocoding(true);
    
    try {
      // Use Nominatim free reverse geocoding API
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${tempLat}&lon=${tempLng}`, {
        headers: { 'User-Agent': 'DibsApp/1.0' }
      });
      const data = await res.json();
      if (data && data.address) {
        // Construct a clean address
        const addrParts = [];
        if (data.address.road) addrParts.push(data.address.road);
        if (data.address.suburb) addrParts.push(data.address.suburb);
        if (data.address.city || data.address.town || data.address.village) addrParts.push(data.address.city || data.address.town || data.address.village);
        if (data.address.state) addrParts.push(data.address.state);
        
        if (addrParts.length > 0) setAddress(addrParts.join(', '));
        if (data.address.postcode) setPincode(data.address.postcode);
      }
    } catch (e) {
      console.error("Geocoding failed:", e);
      Alert.alert('Location Error', 'Could not fetch address for this location.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleMapMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.lat && data.lng) {
        setTempLat(data.lat);
        setTempLng(data.lng);
      }
    } catch (e) {}
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
          ${theme.mapTiles === 'dark_all' ? `.leaflet-tile-pane { filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%); }` : ''}
          .center-marker {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -100%);
            z-index: 1000;
            pointer-events: none;
          }
          .marker-pin {
            width: 36px;
            height: 36px;
            border-radius: 50% 50% 50% 0;
            background: #10B981;
            position: absolute;
            transform: rotate(-45deg);
            left: 50%;
            top: 50%;
            margin: -18px 0 0 -18px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            border: 3px solid white;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <div class="center-marker">
          <div class="marker-pin"></div>
        </div>
        <script>
          const map = L.map('map', { zoomControl: false }).setView([22.5, 78.5], 5);
          L.tileLayer('https://mt1.google.com/vt/lyrs=m&gl=IN&x={x}&y={y}&z={z}', {
            attribution: '© Google Maps',
            maxZoom: 20
          }).addTo(map);

          map.on('move', function() {
            const center = map.getCenter();
            const msg = JSON.stringify({ lat: center.lat, lng: center.lng });
            if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(msg);
            else window.parent.postMessage(msg, '*');
          });
        </script>
      </body>
    </html>
  `;

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={Platform.OS === 'android' ? 25 : 0}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        <Text style={styles.headerTitle}>{t('listAnItem') || 'List an Item'}</Text>
        <Text style={styles.subText}>{t('saveItemsLandfill') || 'Help save items from the landfill'}</Text>

        <TouchableOpacity style={styles.photoUpload} onPress={takePhoto}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <>
              <Feather name="camera" size={40} color={theme.subText} />
              <Text style={styles.photoText}>{t('tapToAddPhoto') || 'Tap to add photo'}</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.label}>{t('title') || 'Title'}</Text>
          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input} 
              placeholder={t('itemTitle') || 'Item title'} 
              placeholderTextColor={theme.subText}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <Text style={styles.label}>{t('price') || 'Price (₹)'}</Text>
          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input} 
              placeholder="0" 
              placeholderTextColor={theme.subText}
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>

          <Text style={styles.label}>{t('condition') || 'Condition'}</Text>
          <View style={styles.conditionRow}>
            <TouchableOpacity 
              style={condition === 'new' ? styles.conditionBtnActive : styles.conditionBtn}
              onPress={() => setCondition('new')}
            >
              <Text style={condition === 'new' ? styles.conditionBtnTextActive : styles.conditionBtnText}>
                {t('new') || 'New'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={condition === 'used' ? styles.conditionBtnActive : styles.conditionBtn}
              onPress={() => setCondition('used')}
            >
              <Text style={condition === 'used' ? styles.conditionBtnTextActive : styles.conditionBtnText}>
                {t('used') || 'Used'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.labelRow}>
            <Text style={styles.label}>{t('address') || 'Address'}</Text>
            <TouchableOpacity style={styles.pickMapBtn} onPress={() => setShowMapModal(true)}>
              <Feather name="map-pin" size={14} color="#000" />
              <Text style={styles.pickMapBtnText}>Pick on Map</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.inputWrapper, { height: 80, alignItems: 'flex-start', paddingTop: 10 }]}>
            {isGeocoding ? (
              <ActivityIndicator size="small" color={theme.primary} style={{ marginTop: 10, alignSelf: 'center', width: '100%' }} />
            ) : (
              <TextInput 
                style={styles.input} 
                placeholder={t('yourAddress') || 'Your address'} 
                placeholderTextColor={theme.subText}
                value={address}
                onChangeText={setAddress}
                multiline
              />
            )}
          </View>

          <Text style={styles.label}>{t('pincode') || 'Pincode'}</Text>
          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input} 
              placeholder="Pincode" 
              placeholderTextColor={theme.subText}
              keyboardType="numeric"
              maxLength={6}
              value={pincode}
              onChangeText={setPincode}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Feather name="check" size={24} color="#000" />
          <Text style={styles.submitButtonText}>{t('submitListing') || 'Submit Listing'}</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Map Picker Modal */}
      <Modal visible={showMapModal} animationType="slide" onRequestClose={() => setShowMapModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowMapModal(false)} style={styles.closeBtn}>
              <Feather name="x" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Drag map to your location</Text>
            <View style={{ width: 24 }} />
          </View>
          
          {Platform.OS === 'web' ? (
            <Iframe
              srcDoc={mapHtml}
              style={{ border: 'none', flex: 1, backgroundColor: theme.background }}
            />
          ) : (
            <WebView
              source={{ html: mapHtml }}
              style={{ flex: 1 }}
              onMessage={handleMapMessage}
              scrollEnabled={false}
            />
          )}
          
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.confirmBtn} onPress={confirmLocation}>
              <Text style={styles.confirmBtnText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  scrollContent: { padding: 20, paddingBottom: 40 },
  headerTitle: { color: theme.text, fontSize: 28, fontWeight: '900', marginBottom: 5 },
  subText: { color: theme.subText, fontSize: 14, marginBottom: 24 },
  photoUpload: { height: 200, backgroundColor: theme.card, borderRadius: 16, borderWidth: 2, borderColor: theme.border, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: 24, overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  photoText: { color: theme.subText, marginTop: 10, fontWeight: '600' },
  form: { gap: 15 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10 },
  label: { color: theme.text, fontWeight: 'bold', fontSize: 16 },
  pickMapBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, gap: 5 },
  pickMapBtnText: { color: '#000', fontWeight: 'bold', fontSize: 12 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, borderRadius: 12, paddingHorizontal: 15, height: 55, borderWidth: 1, borderColor: theme.border },
  input: { flex: 1, color: theme.text, fontSize: 16 },
  conditionRow: { flexDirection: 'row', gap: 8 },
  conditionBtn: { flex: 1, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, paddingVertical: 12, paddingHorizontal: 5, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  conditionBtnActive: { flex: 1, backgroundColor: theme.primaryDim || 'rgba(16, 185, 129, 0.1)', borderWidth: 1, borderColor: theme.primary, paddingVertical: 12, paddingHorizontal: 5, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  conditionBtnText: { color: theme.subText, fontWeight: '600', fontSize: 13, textAlign: 'center' },
  conditionBtnTextActive: { color: theme.primary, fontWeight: 'bold', fontSize: 13, textAlign: 'center' },
  submitButton: { flexDirection: 'row', backgroundColor: theme.primary, height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 40, gap: 10, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  submitButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  
  modalContainer: { flex: 1, backgroundColor: theme.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: Platform.OS === 'ios' ? 60 : 20, backgroundColor: theme.card, borderBottomWidth: 1, borderBottomColor: theme.border },
  closeBtn: { padding: 5 },
  modalTitle: { color: theme.text, fontSize: 16, fontWeight: 'bold' },
  modalFooter: { padding: 20, backgroundColor: theme.card, borderTopWidth: 1, borderTopColor: theme.border, paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
  confirmBtn: { backgroundColor: theme.primary, height: 55, borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5 },
  confirmBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' }
});