import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function MyListings() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [myItems, setMyItems] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'items'), where('userId', '==', 'me'));
    const unsub = onSnapshot(q, snapshot => {
      const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      setMyItems(items);
    });
    return () => unsub();
  }, []);

  const markSold = async (item) => {
    try {
      await updateDoc(doc(db, 'items', item.id), { status: 'sold' });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      console.error('Error marking sold', e);
      Alert.alert('Error', 'Could not mark as sold');
    }
  };

  const deleteItem = async (item) => {
    Alert.alert(
      t('confirmDelete') || 'Delete Item',
      t('deleteConfirmMessage') || 'Are you sure you want to delete this item?',
      [
        { text: t('cancel') || 'Canc
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteItem(item)}>
          <Feather name="trash-2" size={20} color="#fff" />
          <Text style={styles.actionText}>{t('delete') || 'Delete'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={myItems}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={<Text style={styles.emptyText}>{t('noItems')}</Text>}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: { padding: 16 },
  card: {
    height: 250,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  infoOverlay: { position: 'absolute', bottom: 0, width: '100%', padding: 12, backgroundColor: 'rgba(0,0,0,0.8)' },
  title: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  price: { color: '#10B981', fontSize: 18, marginTop: 4 },
  condition: { color: '#A1A1AA', fontSize: 14, marginTop: 2 },
  dibs: { color: '#FFF', fontSize: 13, marginTop: 2 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#111', },
  soldBtn: { backgroundColor: '#10B981', padding: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
  deleteBtn: { backgroundColor: '#EF4444', padding: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
  actionText: { color: '#FFF', marginLeft: 4, fontWeight: '600' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#AAA' },
});
