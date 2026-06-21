import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function MyListings({ items = [], onRemoveItem, onMarkSold }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  // Filter items to show those added by the user (or older items that lack a userId)
  const myItems = items.filter(item => item.userId === 'test-user-1' || !item.userId);

  const markSold = (item) => {
    if (onMarkSold) onMarkSold(item.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const deleteItem = (item) => {
    Alert.alert(
      t('confirmDelete') || 'Delete Item',
      t('deleteConfirmMessage') || 'Are you sure you want to delete this item?',
      [
        { text: t('cancel') || 'Cancel', style: 'cancel' },
        { text: t('delete') || 'Delete', style: 'destructive', onPress: () => {
            if (onRemoveItem) onRemoveItem(item.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => {
    const safeImage = item.image || item.imageUri || 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800';
    return (
    <View style={styles.card}>
      <Image source={{ uri: safeImage }} style={styles.image} />
      <View style={styles.infoContent}>
        <View style={styles.infoHeader}>
          <View style={styles.textCol}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.price}>{item.price || t('free')}</Text>
            <Text style={styles.condition}>{item.condition}</Text>
          </View>
          <View style={styles.dibsBadge}>
            <Feather name="heart" size={14} color="#FF3B30" />
            <Text style={styles.dibsText}>{item.dibsCount || 0} Dibs</Text>
          </View>
        </View>
      </View>
      <View style={styles.actionsRow}>
        {item.status !== 'sold' ? (
          <TouchableOpacity style={styles.soldBtn} onPress={() => markSold(item)} accessibilityRole="button" accessibilityLabel={`Mark ${item.title} as sold`}>
            <Feather name="check" size={18} color="#000" />
            <Text style={styles.actionText}>{t('markSold') || 'Sold'}</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.soldBtn, { backgroundColor: theme.border }]}>
            <Feather name="check-circle" size={18} color={theme.subText} />
            <Text style={[styles.actionText, { color: theme.subText }]}>Sold Out</Text>
          </View>
        )}
        <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteItem(item)} accessibilityRole="button" accessibilityLabel={`Delete ${item.title}`}>
          <Feather name="trash-2" size={18} color="#fff" />
          <Text style={[styles.actionText, { color: '#fff' }]}>{t('delete') || 'Delete'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )};

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

const getStyles = (theme) => StyleSheet.create({
  listContainer: { padding: 16, paddingBottom: 40 },
  card: {
    marginBottom: 16,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: { width: '100%', height: 120, resizeMode: 'cover' },
  infoContent: { padding: 10, paddingBottom: 6, backgroundColor: theme.card },
  infoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  textCol: { flex: 1, paddingRight: 10 },
  title: { color: theme.text, fontSize: 16, fontWeight: '800', letterSpacing: 0.1 },
  price: { color: theme.primary, fontSize: 14, marginTop: 2, fontWeight: '700' },
  condition: { color: theme.subText, fontSize: 12, marginTop: 2, textTransform: 'capitalize', fontWeight: '500' },
  dibsBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,59,48,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4, borderWidth: 1, borderColor: 'rgba(255,59,48,0.3)' },
  dibsText: { color: '#FF3B30', fontSize: 11, fontWeight: 'bold' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingBottom: 10, backgroundColor: theme.background },
  soldBtn: { flex: 1, backgroundColor: theme.primary, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginRight: 5, elevation: 1 },
  deleteBtn: { flex: 1, backgroundColor: '#EF4444', paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: 5, elevation: 1 },
  actionText: { color: '#000', marginLeft: 6, fontWeight: 'bold', fontSize: 13 },
  emptyText: { textAlign: 'center', marginTop: 50, color: theme.subText, fontSize: 16 },
});
