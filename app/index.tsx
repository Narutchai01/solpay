import { useMobileWallet } from "@wallet-ui/react-native-web3js";
import { Redirect } from "expo-router";

export default function Index() {
  const { account } = useMobileWallet();
  const isConnected = Boolean(account);

  return <Redirect href={isConnected ? "/(tabs)" : "/(auth)"} />;
}
