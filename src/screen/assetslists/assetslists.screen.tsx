import { GlassCard } from "@/src/components/card/glass";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";

const ASSETS = [
  {
    id: 1,
    name: "Solana",
    sub: "0.10933530228646213 SOL",
    val: "1,500.00",
    icon: "logo-bitcoin",
  },
  {
    id: 2,
    name: "USDC",
    sub: "0.0312304 USDC",
    val: "1,000.00",
    icon: "cash-outline",
  },
  {
    id: 3,
    name: "USDT",
    sub: "29.500427134510762 USDT",
    val: "950.00",
    icon: "logo-usd",
  },
  {
    id: 4,
    name: "JupSOL",
    sub: "0.138711 JUP",
    val: "550.00",
    icon: "planet-outline",
  },
  {
    id: 5,
    name: "PYTH",
    sub: "14.1651 PYTH",
    val: "500.00",
    icon: "pulse-outline",
  },
  {
    id: 6,
    name: "WIF",
    sub: "2.5573 WIF",
    val: "300.00",
    icon: "logo-bitcoin",
  },
  {
    id: 7,
    name: "ORCA",
    sub: "0.775478 ORCA",
    val: "200.00",
    icon: "logo-bitcoin",
  },
];

export const AssetsListsScreen = () => {
  const headerHeight = useHeaderHeight();
  const renderItem = ({ item }: { item: (typeof ASSETS)[number] }) => (
    <GlassCard style={styles.assetCard}>
      <View style={styles.assetInner}>
        <View style={styles.assetLeft}>
          <View style={styles.iconWrapper}>
            <Ionicons
              name={item.icon as any}
              size={24}
              color={Theme.colors.surface}
            />
          </View>

          <View>
            <Text style={styles.assetName}>{item.name}</Text>
            <Text style={styles.assetSub}>{item.sub}</Text>
          </View>
        </View>

        <Text style={styles.assetValue}>{item.val} THB</Text>
      </View>
    </GlassCard>
  );
  return (
    <GradientLayout>
      <SafeAreaView style={styles.container}>
        {/* Assets List */}
        <FlatList
          data={ASSETS}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: headerHeight + 20 },
          ]}
          ListHeaderComponent={() => (
            <Text style={styles.sectionTitle}>All Assets</Text>
          )}
        />
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h5,
    fontWeight: "bold",
  },

  /* Section */
  sectionTitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "semibold",
    marginBottom: 16,
  },

  /* Asset Card */
  assetCard: {
    marginBottom: 16,
  },
  assetInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  assetLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  assetName: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h7,
    fontWeight: "semibold",
  },
  assetSub: {
    color: Theme.colors.g50,
    fontSize: Theme.fontSize.textS,
    marginTop: 4,
  },

  assetValue: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h7,
    fontWeight: "semibold",
  },
});
