import { ButtonWithIcon } from "@/src/components/button/buttonWithIcon";
import { GlassCard } from "@/src/components/card/glass";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Theme } from "@/src/theme/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ASSETS_DATA = [
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
  const [isVisible, setIsVisible] = useState(true);
  const rawBalance = "1,000.00";

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
          <GlassCard style={styles.balanceCard}>
            <View style={styles.cardContent}>
              <Text style={styles.balanceLabel}>Total balance</Text>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceValue}>
                  {isVisible ? `${rawBalance} THB` : "****** THB"}
                </Text>
                <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                  <Ionicons
                    name={isVisible ? "eye-outline" : "eye-off-outline"}
                    style={[styles.iconSize, styles.eyeIcon]}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.actionButtons}>
                <ButtonWithIcon
                  label="Top Up"
                  icon={
                    <Ionicons
                      name="add"
                      size={24}
                      color={Theme.colors.surface}
                    />
                  }
                  onPress={() => {}}
                />
                <ButtonWithIcon
                  label="Swap"
                  icon={
                    <MaterialCommunityIcons
                      name="swap-horizontal"
                      size={24}
                      color={Theme.colors.surface}
                    />
                  }
                  onPress={() => {}}
                />
              </View>
            </View>
          </GlassCard>

          {/* Assets Section */}
          <GlassCard style={styles.assetsCard}>
            <View style={styles.assetsContent}>
              <View style={styles.assetsHeader}>
                <Text style={styles.assetsTitle}>Assets</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>

              {ASSETS_DATA.map((item) => (
                <View key={item.id} style={styles.assetItem}>
                  <View style={styles.assetLeft}>
                    <View style={styles.assetIconBG}>
                      <Ionicons
                        name={item.icon as any}
                        size={24}
                        color={Theme.colors.surface}
                      />
                    </View>
                    <View>
                      <Text style={styles.assetNameText}>{item.name}</Text>
                      <Text style={styles.assetSubText} numberOfLines={1}>
                        {item.sub}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.assetValueText}>{item.val} THB</Text>
                </View>
              ))}
            </View>
          </GlassCard>
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
  // Balance Card
  balanceCard: {
    marginTop: 10,
  },
  cardContent: {
    padding: 24,
    alignItems: "center",
  },
  balanceLabel: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h5,
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  balanceValue: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h3,
    fontWeight: "bold",
  },
  eyeIcon: {
    marginLeft: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  actionBtn: {
    backgroundColor: Theme.colors.surface,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
  },
  actionBtnText: {
    fontSize: Theme.fontSize.h6,
    fontWeight: "bold",
    color: Theme.colors.onSurface,
  },
  // Assets Container
  assetsCard: {
    marginTop: 32,
  },
  assetsContent: {
    padding: 20,
    paddingBottom: 10,
  },
  assetsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  assetsTitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h5,
    fontWeight: "bold",
  },
  viewAllText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textS,
    textDecorationLine: "underline",
  },
  assetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  assetLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  assetIconBG: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  assetNameText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h7,
    fontWeight: "medium",
  },
  assetSubText: {
    color: Theme.colors.g50,
    fontSize: Theme.fontSize.textS,
    marginTop: 2,
    maxWidth: 200,
  },
  assetValueText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h7,
    fontWeight: "medium",
  },
});
