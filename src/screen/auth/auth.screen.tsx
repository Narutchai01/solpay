import SolpayLogo from "@/assets/solpay-logo.svg";
import { Button } from "@/src/components/button/button";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Theme } from "@/src/theme/theme";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export const ConnectWalletScreen = () => {
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
          {/* <Button title="Connect Wallet" onPress={() => {}} /> */}
          <Button title="test" />
          <Link href="/_sitemap" style={{ marginTop: 20, color: "blue" }}>
            🗺️ เปิดแผนที่หน้าทั้งหมด (Sitemap)
          </Link>
        </View>
      </View>
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
    paddingHorizontal: 20,
    gap: 24,
  },
  logo: {
    width: 120,
    height: 120,
  },
  header: {
    fontSize: Theme.fontSize.h4,
    fontWeight: "bold",
    marginBottom: 16,
    color: Theme.colors.surface,
  },
  description: {
    fontSize: Theme.fontSize.h6,
    textAlign: "left",
    color: Theme.colors.surface,
  },
});
