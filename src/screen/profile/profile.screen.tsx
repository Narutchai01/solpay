import { Button } from "@/src/components/button/button";
import { ConfirmModal } from "@/src/components/modal/Confirm";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { LoadingSpinner } from "@/src/components/shard/loadingSpinner";
import { Theme } from "@/src/core/theme/theme";
import { useAccount } from "@/src/hooks/useAccount";
import { useWallet } from "@/src/hooks/useWallet";
import { useAuthStore } from "@/src/store/auth.store";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const { profile } = useAccount();
  const { disconnect } = useWallet();
  const clearAuth = useAuthStore((state) => state.clear);
  const fullAddress = profile?.public_address ?? "";

  const maskAddress = (address: string) => {
    return address.length > 8
      ? `${address.slice(0, 4)}********${address.slice(-4)}`
      : "********";
  };

  const handleLogout = async () => {
    try {
      await disconnect();
      clearAuth();
      await AsyncStorage.clear();
      router.replace("/(auth)");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!profile) {
    return (
      <GradientLayout>
        <SafeAreaView style={styles.container}>
          <LoadingSpinner overlay />
        </SafeAreaView>
      </GradientLayout>
    );
  }

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
                {"\u00A0\u00A0"}
                <Text onPress={() => setIsVisible(!isVisible)}>
                  <Ionicons
                    name={isVisible ? "eye-outline" : "eye-off-outline"}
                    size={24}
                    color={Theme.colors.surface}
                  />
                </Text>
              </Text>
            </View>
          </View>

          {/* Menu Section */}
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => setShowKycModal(true)}
            >
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
                  title={
                    profile.is_kyc_verified ? "ยืนยันแล้ว" : "ยังไม่ยืนยัน"
                  }
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
            onPress={() => setShowLogoutModal(true)}
            style={styles.logoutButton}
          />
        </View>

        <ConfirmModal
          visible={showKycModal}
          imageSource={require("@/assets/images/modalKYC.png")}
          title="Verify Your Identity"
          description="Please verify your identity before proceeding with any transactions."
          cancelLabel="Cancel"
          confirmLabel="Confirm"
          onCancel={() => setShowKycModal(false)}
          onConfirm={() => {
            setShowKycModal(false);
            router.push("/verifyIdentityKYC");
          }}
        />

        <ConfirmModal
          visible={showLogoutModal}
          title="Are you sure you want to log out of your account?"
          cancelLabel="Cancel"
          confirmLabel="Log out"
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={() => {
            setShowLogoutModal(false);
            handleLogout();
          }}
        />
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
    flexWrap: "wrap",
    alignItems: "center",
  },
  userAddress: {
    color: "white",
    fontSize: Theme.fontSize.h4,
    fontWeight: "700",
    lineHeight: Theme.fontSize.h4 * 1.4,
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
  },
});
