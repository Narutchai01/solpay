import { AssetItem } from "@/src/components/assetitem/assetitem";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { useHeaderHeight } from "@react-navigation/elements";
import React from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../core/theme/theme";

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

const ListHeader = () => <Text style={styles.sectionTitle}>All Assets</Text>;

export const AssetsListsScreen = () => {
  const headerHeight = useHeaderHeight();

  return (
    <GradientLayout>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={ASSETS}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <AssetItem item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: headerHeight + 20 },
          ]}
          ListHeaderComponent={ListHeader}
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
  sectionTitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "semibold",
    marginBottom: 16,
  },
});
