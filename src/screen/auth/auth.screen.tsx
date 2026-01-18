import { Link } from "expo-router";
import { Text, View } from "react-native";

export const ConnectWalletScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Auth Screen</Text>
      <Link href="/(tabs)">
        <Text style={{ color: "blue", marginTop: 20 }}>Go to Home</Text>
      </Link>
    </View>
  );
};
