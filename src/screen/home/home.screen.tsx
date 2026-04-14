import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Theme } from "@/src/core/theme/theme";
import { useBalance } from "@/src/hooks/useBalance";
import { useTokenAccounts } from "@/src/hooks/useTokenAccounts";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AssetsComponent } from "./assets.component";
import { BalanceComponent } from "./balance.component";

export const HomeScreen = () => {
  const { balance, GetBalance } = useBalance();
  const { assets, fetchAssets } = useTokenAccounts();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    GetBalance();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([GetBalance(), fetchAssets()]);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Theme.colors.surface}
              colors={[Theme.colors.v300]}
            />
          }
        >
          {/* Header Section */}
          <View style={styles.header}>
            <TouchableOpacity>
              <Ionicons name="person-circle" style={styles.profileIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace("/notifications")}>
              <Ionicons name="notifications-outline" style={styles.iconSize} />
            </TouchableOpacity>
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.helloText}>Hello</Text>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
          </View>

          {/* Balance Card */}
          <BalanceComponent balance={balance?.thb_amount ?? 0} currency="THB" />

          {/* Assets Section */}
          <AssetsComponent assets={assets} />
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
    marginTop: 24,
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
    fontWeight: "500",
  },
  welcomeText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h3,
    fontWeight: "700",
  },
  iconSize: {
    fontSize: 24,
    color: Theme.colors.surface,
  },
});
