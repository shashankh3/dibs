import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';

const MOCK_USERS = [
  { id: 'u1', name: 'Aisha K.', avatar: 'https://i.pravatar.cc/100?img=1', items: 12, co2: 450 },
  { id: 'u2', name: 'Rahul V.', avatar: 'https://i.pravatar.cc/100?img=11', items: 8, co2: 320 },
  { id: 'u3', name: 'Sarah M.', avatar: 'https://i.pravatar.cc/100?img=5', items: 5, co2: 180 },
];

export default function Leaderboard({ currentUserScore }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const rankedUsers = useMemo(() => {
    const allUsers = [...MOCK_USERS, { id: 'me', name: t('you'), avatar: 'https://i.pravatar.cc/100?img=3', isMe: true, ...currentUserScore }];
    return allUsers.sort((a, b) => b.co2 - a.co2);
  }, [currentUserScore, t]);

  const renderItem = ({ item, index }) => (
    <View style={[styles.rankCard, item.isMe && styles.myRankCard]}>
      <Text style={styles.rankNumber}>#{index + 1}</Text>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={[styles.userName, item.isMe && styles.myUserName]}>{item.name}</Text>
        <Text style={styles.userItems}>{item.items} {t('itemsRescued')}</Text>
      </View>
      <View style={styles.scorePill}>
        <Ionicons name="leaf" size={14} color={item.isMe ? "#000" : theme.primary} />
        <Text style={[styles.scoreText, item.isMe && { color: '#000' }]}>{item.co2}kg</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('radiusRank')}</Text>
      <FlatList 
        data={rankedUsers}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1, padding: 20 },
  sectionTitle: { color: theme.text, fontSize: 20, fontWeight: '900', marginBottom: 16 },
  rankCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, padding: 16, borderRadius: 16, marginBottom: 12 },
  myRankCard: { backgroundColor: theme.primary, borderColor: '#059669', borderWidth: 1 },
  rankNumber: { color: theme.subText, fontSize: 18, fontWeight: 'bold', width: 35 },
  avatar: { width: 46, height: 46, borderRadius: 23, marginRight: 12 },
  userInfo: { flex: 1 },
  userName: { color: theme.text, fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  myUserName: { color: '#000' },
  userItems: { color: theme.subText, fontSize: 12 },
  scorePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#064E3B', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  scoreText: { color: theme.primary, fontWeight: 'bold', marginLeft: 4, fontSize: 14 }
});