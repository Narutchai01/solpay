import SolpayLogo from "@/assets/solpay-logo.svg";
import { Button } from "@/src/components/button/button";
import { ConfirmModal } from "@/src/components/modal/Confirm";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Theme } from "@/src/core/theme/theme";
import { useAuth } from "@/src/hooks/useAuth";
import { useAuthStore } from "@/src/store/auth.store";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export const ConnectWalletScreen = () => {
  const { account, login, isLoading, errorMessage, hasPin, isInitialized } =
    useAuth();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setShowErrorModal(true);
    }
  }, [errorMessage]);

  const handleConnectWallet = async () => {
    try {
      const authSession = await login();
      if (authSession) {
        if (hasPin) {
          router.replace("/(tabs)");
        } else {
          router.replace("/pin");
        }
      }
    } catch (error) {
      console.error("Wallet connect failed:", error);
      setShowErrorModal(true);
    }
  };

  if (!isInitialized) return null;

  if (account && accessToken) {
    return <Redirect href={hasPin ? "/(tabs)" : "/pin"} />;
  }
  return (
    <GradientLayout>
      <View style={styles.container}>
        <View style={styles.content}>
          <SolpayLogo style={styles.logo} />
          <Text style={styles.header}>Welcome To SolPay</Text>
          <Text style={styles.description}>
            Financial technology is evolving rapidly, especially with the
            emergence of Decentralized Finance (DeFi) powered by blockchain.
          </Text>
          <Button
            title={isLoading ? "Connecting..." : "Connect Wallet"}
            onPress={handleConnectWallet}
            color="v300"
            style={styles.connectButton}
          />
        </View>
      </View>

      <ConfirmModal
        visible={showErrorModal}
        title="Connection Error"
        description={
          errorMessage || "Failed to connect wallet. Please try again."
        }
        iconName="close-circle"
        iconColor={Theme.colors.error}
        confirmLabel="Close"
        onConfirm={() => setShowErrorModal(false)}
      />
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    gap: 24,
  },
  logo: {
    width: 120,
    height: 120,
  },
  header: {
    fontSize: Theme.fontSize.h4,
    fontWeight: "700",
    color: Theme.colors.surface,
  },
  description: {
    textAlign: "center",
    fontSize: Theme.fontSize.h6,
    color: Theme.colors.surface,
    paddingTop: 10,
    paddingBottom: 10,
  },
  errorText: {
    fontSize: Theme.fontSize.textS,
    color: Theme.colors.error,
    textAlign: "center",
  },
  connectButton: {
    paddingVertical: 10,
    width: "100%",
  },
});
