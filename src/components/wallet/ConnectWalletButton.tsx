import { useMobileWallet } from "@wallet-ui/react-native-web3js";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export function ConnectWalletButton() {
  const { account, connect, disconnect } = useMobileWallet();

  const isConnected = Boolean(account);

  const handlePress = async () => {
    if (isConnected) {
      await disconnect();
      return;
    }

    await connect();
  };

  return (
    <TouchableOpacity
      style={[styles.button, isConnected ? styles.disconnect : styles.connect]}
      onPress={handlePress}
    >
      <Text style={styles.text}>{isConnected ? "Disconnect" : "Connect"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 150,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  connect: {
    backgroundColor: "#6C4CFF",
  },
  disconnect: {
    backgroundColor: "#D33F49",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
