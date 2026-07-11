import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useTheme, shadow } from '../theme';
import { BANNER_UNIT } from '../lib/adManager';
import { openExternal } from '../lib/openLink';
import { useStore } from '../lib/store';
import { personalized, matchLabel, latest, news } from '../lib/reco';
import Header, { HeaderButton } from '../components/Header';
import SectionHeader from '../components/SectionHeader';
import NewsSection from '../components/NewsSection';
import ArticleCard from '../components/ArticleCard';

export default function HomeScreen({ navigation }) {
  const t = useTheme();
  const { isBookmarked, toggleBookmark, profile, articles } = useStore();
  const sits = profile.situations;

  const matched = sits.length > 0 ? personalized(articles, sits).slice(0, 6) : [];
  const matchedIds = matched.map((a) => a.id);
  const rest = latest(articles, matchedIds);
  const newsItems = news(articles);

  const cardProps = (item) => ({
    item,
    bookmarked: isBookmarked(item.id),
    onToggleBookmark: toggleBookmark,
    onPress: () => navigation.navigate('Detail', { id: item.id }),
  });

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <Header title="지원금·정책" right={<HeaderButton label="⚙" onPress={() => navigation.navigate('Settings')} />} />
      <ScrollView contentContainerStyle={styles.content}>
        <NewsSection items={newsItems} onPressItem={(n) => openExternal(n.url)} />

        {sits.length > 0 ? (
          matched.length > 0 ? (
            <>
              <SectionHeader title="내 상황에 맞는 지원금" count={matched.length} accent />
              {matched.map((item) => (
                <ArticleCard key={item.id} {...cardProps(item)} matchLabel={matchLabel(item, sits)} />
              ))}
            </>
          ) : null
        ) : (
          <Pressable
            onPress={() => navigation.navigate('Settings')}
            style={[styles.nudge, shadow, { backgroundColor: t.accentSoft, borderColor: t.accent }]}
          >
            <Text style={{ fontSize: 22 }}>🎯</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.nudgeT, { color: t.accent }]}>관심 상황을 고르면 맞춤 추천!</Text>
              <Text style={[styles.nudgeS, { color: t.muted }]}>청년·육아·구직·주거·시니어 등 내 상황을 설정해보세요.</Text>
            </View>
            <Text style={{ color: t.accent, fontSize: 20 }}>›</Text>
          </Pressable>
        )}

        <SectionHeader title="전체 최신" />
        {rest.map((item, i) => (
          <React.Fragment key={item.id}>
            <ArticleCard {...cardProps(item)} />
            {i === 1 && (
              <View style={[styles.adBox, shadow, { borderColor: t.border, backgroundColor: t.surface }]}>
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
  content: { padding: 16, gap: 11 },
  nudge: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 16, padding: 16 },
  nudgeT: { fontSize: 15, fontWeight: '700' },
  nudgeS: { fontSize: 12.5, marginTop: 3, lineHeight: 17 },
  adBox: { borderWidth: 1, borderRadius: 16, padding: 12, alignItems: 'center', gap: 6 },
  adLabel: { fontSize: 10, alignSelf: 'flex-start', fontWeight: '600' },
});
