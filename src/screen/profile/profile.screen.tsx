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
import React, { useState, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const ProfileScreen = () => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const scale = SCREEN_WIDTH / 375;

  const [isVisible, setIsVisible] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { profile, GetProfile } = useAccount();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await GetProfile();
    setRefreshing(false);
  }, [GetProfile]);
  const { disconnect } = useWallet();
  const clearAuth = useAuthStore((state) => state.clear);
  const fullAddress = profile?.public_address ?? "";

  const dynamicStyles = useMemo(
    () => ({
      navHeader: {
        paddingHorizontal: 16 * scale,
        paddingBottom: 10 * scale,
      },
      scrollContent: {
        paddingHorizontal: 16 * scale,
        paddingTop: 8 * scale,
      },
      userInfoSection: {
        marginBottom: 32 * scale,
      },
      userAddress: {
        fontSize: Math.min(Theme.fontSize.h4, 24 * scale),
        lineHeight: Math.min(Theme.fontSize.h4 * 1.4, 33.6 * scale),
      },
      menuItem: {
        paddingVertical: 18 * scale,
      },
      menuText: {
        fontSize: Math.min(Theme.fontSize.h6, 16 * scale),
        marginLeft: 14 * scale,
      },
      statusTagText: {
        fontSize: Math.min(Theme.fontSize.textM, 14 * scale),
      },
      footer: {
        paddingHorizontal: 16 * scale,
      },
      logoutButton: {
        paddingVertical: 10 * scale,
      },
      iconSize28: 28 * scale,
      iconSize24: 24 * scale,
      iconSize20: 20 * scale,
    }),
    [scale],
  );

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
        <View style={[styles.navHeader, dynamicStyles.navHeader]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={dynamicStyles.iconSize28}
              color={Theme.colors.surface}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            dynamicStyles.scrollContent,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Theme.colors.surface}
              colors={[Theme.colors.v300]}
            />
          }
        >
          {/* User Info Section */}
          <View style={[styles.userInfoSection, dynamicStyles.userInfoSection]}>
            <View style={styles.addressWrapper}>
              <Text
                style={[styles.userAddress, dynamicStyles.userAddress]}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {isVisible ? fullAddress : maskAddress(fullAddress)}
              </Text>
              <TouchableOpacity
                onPress={() => setIsVisible(!isVisible)}
                style={{ marginLeft: 12 * scale }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isVisible ? "eye-outline" : "eye-off-outline"}
                  size={dynamicStyles.iconSize24}
                  color={Theme.colors.surface}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Menu Section */}
          <View style={styles.menuContainer}>
            <TouchableOpacity
              disabled={profile.is_kyc_verified}
              style={[styles.menuItem, dynamicStyles.menuItem]}
              activeOpacity={0.7}
              onPress={() => setShowKycModal(true)}
            >
              <View style={styles.menuLeft}>
                <MaterialCommunityIcons
                  name="badge-account-horizontal-outline"
                  size={dynamicStyles.iconSize24}
                  color={Theme.colors.amber}
                />
                <Text style={[styles.menuText, dynamicStyles.menuText]}>
                  KYC
                </Text>
              </View>

              <View style={styles.menuRight}>
                {/* Tag Status */}
                <Button
                  disabled={true}
                  title={
                    profile.is_kyc_verified
                      ? "KYC Verified"
                      : profile.user
                        ? !profile.is_kyc_verified &&
                          profile.user.status === "PENDING"
                          ? "KYC Verifying"
                          : !profile.is_kyc_verified &&
                              profile.user.status === "REJECTED"
                            ? "KYC REJECTED"
                            : "NOT Verified"
                        : "NOT Verified"
                  }
                  variant="tag"
                  color="surface"
                  style={styles.statusTag}
                  textStyle={[
                    styles.statusTagText,
                    dynamicStyles.statusTagText,
                  ]}
                />
                <Ionicons
                  name="chevron-forward"
                  size={dynamicStyles.iconSize20}
                  color={Theme.colors.g50}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Logout Button */}
        <View style={[styles.footer, dynamicStyles.footer]}>
          <Button
            title="Log Out"
            variant="solid"
            color="v300"
            onPress={() => setShowLogoutModal(true)}
            style={[styles.logoutButton, dynamicStyles.logoutButton]}
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
  navHeader: {},
  scrollContent: {},
  userInfoSection: {},
  addressWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAddress: {
    color: "white",
    fontWeight: "700",
    flexShrink: 1,
  },
  menuContainer: {
    borderTopWidth: 0.5,
    borderTopColor: Theme.colors.glassBackground,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    color: "white",
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
  },
  footer: {},
  logoutButton: {
    width: "100%",
  },
});
