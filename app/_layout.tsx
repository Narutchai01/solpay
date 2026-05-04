import { clusterApiUrl } from "@solana/web3.js";
import { MobileWalletProvider } from "@wallet-ui/react-native-web3js";
import { Stack } from "expo-router";

const chain = "solana:devnet";
const endpoint = clusterApiUrl("devnet");
const identity = {
  name: "SolPay",
  uri: "https://github.com/Narutchai01",
  icon: "favicon.png",
};

export default function RootLayout() {
  return (
    <MobileWalletProvider chain={chain} endpoint={endpoint} identity={identity}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </MobileWalletProvider>
  );
}
