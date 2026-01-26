import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AssetData, AssetsComponent } from "./assets.component";
import { BalanceComponent } from "./balance.component";

const ASSETS_MOCK: AssetData[] = [
  {
    id: "1",
    name: "Solana",
    sub: "0.10933530228646213 SOL",
    val: "1,500.00",
    icon: "logo-bitcoin",
  },
  {
    id: "2",
    name: "USDC",
    sub: "0.0312304 USDC",
    val: "1,000.00",
    icon: "cash-outline",
  },
  {
    id: "3",
    name: "USDT",
    sub: "29.500427134510762 USTD",
    val: "950.00",
    icon: "logo-usd",
  },
  {
    id: "4",
    name: "JupSOL",
    sub: "0.138711 JUP",
    val: "550.00",
    icon: "planet-outline",
  },
  {
    id: "5",
    name: "PYTH",
    sub: "14.1651 PYTH",
    val: "500.00",
    icon: "pulse-outline",
  },
];

export const HomeScreen = () => {
  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <TouchableOpacity>
              <Ionicons name="person-circle" style={styles.profileIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" style={styles.iconSize} />
            </TouchableOpacity>
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.helloText}>Hello</Text>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
          </View>

          {/* Balance Card */}
          <BalanceComponent balance="1,500.00" currency="THB" />

          {/* Assets Section */}
          <AssetsComponent assets={ASSETS_MOCK} />
        </ScrollView>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  profileIcon: {
    fontSize: 44,
    color: Theme.colors.surface,
  },
  welcomeContainer: {
    marginTop: 25,
    marginBottom: 32,
  },
  helloText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h4,
    fontWeight: "medium",
  },
  welcomeText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h3,
    fontWeight: "bold",
  },
  iconSize: {
    fontSize: 24,
    color: Theme.colors.surface,
  },
});
