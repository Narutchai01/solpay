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
import { AssetsComponent } from "./assets.component";
import { BalanceComponent } from "./balance.component";

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
          <BalanceComponent
            balance="1,500.00"
            currency="THB"
            onTopUp={() => {}}
            onSwap={() => {}}
          />

          {/* Assets Section */}
          <AssetsComponent />
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
