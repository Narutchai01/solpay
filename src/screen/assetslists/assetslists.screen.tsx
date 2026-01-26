import { GlassCard } from "@/src/components/card/glass";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const navigation = useNavigation();
  return (
    <GradientLayout>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
            >
              <Ionicons
                name="chevron-back-outline"
                size={24}
                color={Theme.colors.surface}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Assets</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Section All Assets */}
          <Text style={styles.sectionTitle}>All Assets</Text>

          {/* Assets List */}
          {ASSETS.map((item) => (
            <GlassCard key={item.id} style={styles.assetCard}>
              <View style={styles.assetInner}>
                {/* Name+Value */}
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

                {/* Amount */}
                <Text style={styles.assetValue}>{item.val} THB</Text>
              </View>
            </GlassCard>
          ))}
        </ScrollView>
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
