import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useTheme } from '../theme';
import { SUBSIDIES, CATEGORIES } from '../data/mock';
import { BANNER_UNIT } from '../lib/adManager';
import { openExternal } from '../lib/openLink';
import { useStore } from '../lib/store';
import Header from '../components/Header';
import Chips from '../components/Chips';
import SubsidyCard from '../components/SubsidyCard';
import NewsSection from '../components/NewsSection';

export default function HomeScreen({ navigation }) {
  const t = useTheme();
  const { isBookmarked, toggleBookmark } = useStore();
  const [filter, setFilter] = useState('전체');

  const list = SUBSIDIES.filter(
    (x) => filter === '전체' || x.categories.includes(filter)
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <Header title="지원금" />
      <ScrollView contentContainerStyle={styles.content}>
        <NewsSection onPressItem={(n) => openExternal(n.url)} />
        <Chips items={CATEGORIES} value={filter} onChange={setFilter} />
        {list.map((item, i) => (
          <React.Fragment key={item.id}>
            <SubsidyCard
              item={item}
              bookmarked={isBookmarked(item.id)}
              onToggleBookmark={toggleBookmark}
              onPress={() => navigation.navigate('Detail', { id: item.id })}
            />
            {i === 1 && (
              <View style={[styles.adBox, { borderColor: t.border, backgroundColor: t.surface }]}>
                <Text style={[styles.adLabel, { color: t.faint }]}>광고</Text>
                <BannerAd
                  unitId={BANNER_UNIT}
                  size={BannerAdSize.MEDIUM_RECTANGLE}
                  requestOptions={{ requestNonPersonalizedAdsOnly: true }}
                />
              </View>
            )}
          </React.Fragment>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14, gap: 9 },
  adBox: { borderWidth: 1, borderRadius: 12, padding: 10, alignItems: 'center', gap: 6 },
  adLabel: { fontSize: 10, alignSelf: 'flex-start', fontWeight: '600' },
});
