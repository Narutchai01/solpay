import { Button } from "@/src/components/button/button";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Theme } from "@/src/core/theme/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const ProfileScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const fullAddress = "xxx326xxxxxxdssdsa";

  const maskAddress = (address: string) => {
    return address.length > 8
      ? `${address.slice(0, 4)}********${address.slice(-4)}`
      : "********";
  };

  return (
    <GradientLayout>
      <SafeAreaView style={styles.container}>
        <View style={styles.navHeader}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={28}
              color={Theme.colors.surface}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* User Info Section */}
          <View style={styles.userInfoSection}>
            <View style={styles.addressWrapper}>
              <Text style={styles.userAddress}>
                {isVisible ? fullAddress : maskAddress(fullAddress)}
              </Text>

              <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                <Ionicons
                  name={isVisible ? "eye-outline" : "eye-off-outline"}
                  style={[styles.iconSize, styles.eyeIcon]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Menu Section */}
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuLeft}>
                <MaterialCommunityIcons
                  name="badge-account-horizontal-outline"
                  size={24}
                  color={Theme.colors.amber}
                />
                <Text style={styles.menuText}>ยืนยันตัวตน</Text>
              </View>

              <View style={styles.menuRight}>
                {/* Tag Status */}
                <Button
                  title="ยืนยันแล้ว"
                  variant="tag"
                  color="surface"
                  style={styles.statusTag}
                  textStyle={styles.statusTagText}
                />
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Theme.colors.g50}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Logout Button */}
        <View style={styles.footer}>
          <Button
            title="Log Out"
            variant="solid"
            color="v300"
            onPress={() => console.log("Logout pressed")}
            style={styles.logoutButton}
          />
        </View>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navHeader: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  userInfoSection: {
    marginBottom: 32,
  },
  addressWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAddress: {
    color: "white",
    fontSize: Theme.fontSize.h4,
    fontWeight: "700",
  },
  eyeIcon: { marginLeft: 20 },
  iconSize: {
    fontSize: 24,
    color: Theme.colors.surface,
  },
  menuContainer: {
    borderTopWidth: 0.5,
    borderTopColor: Theme.colors.glassBackground,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    color: "white",
    fontSize: Theme.fontSize.h6,
    marginLeft: 14,
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusTag: {
    backgroundColor: "rgba(0, 192, 135, 0.15)",
    borderWidth: 0,
    marginRight: 8,
  },
  statusTagText: {
    color: Theme.colors.success,
    fontSize: Theme.fontSize.textM,
  },
  footer: {
    paddingHorizontal: 16,
  },
  logoutButton: {
    width: "100%",
    paddingVertical: 10,
  },
});
