import { Button } from "@/src/components/button/button";
import { GlassCard } from "@/src/components/card/glass";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import {
    FontAwesome,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../core/theme/theme";
import { SlippageModal } from "./slippageModal.component";
import { TokenAsset, TokenSelectModal } from "./tokenSelectModal.component";

const ASSETS: TokenAsset[] = [
  {
    id: 1,
    name: "Solana",
    sub: "0.10933530228646213 SOL",
    val: "1,500.00",
    icon: "logo-bitcoin",
  },
  {
    id: 2,
    name: "USDC",
    sub: "0.0312304 USDC",
    val: "1,000.00",
    icon: "cash-outline",
  },
  {
    id: 3,
    name: "USDT",
    sub: "29.500427134510762 USDT",
    val: "950.00",
    icon: "logo-usd",
  },
  {
    id: 4,
    name: "JupSOL",
    sub: "0.138711 JUP",
    val: "550.00",
    icon: "planet-outline",
  },
  {
    id: 5,
    name: "PYTH",
    sub: "14.1651 PYTH",
    val: "500.00",
    icon: "pulse-outline",
  },
  {
    id: 6,
    name: "WIF",
    sub: "2.5573 WIF",
    val: "300.00",
    icon: "logo-bitcoin",
  },
  {
    id: 7,
    name: "ORCA",
    sub: "0.775478 ORCA",
    val: "200.00",
    icon: "logo-bitcoin",
  },
  {
    id: 8,
    name: "COPE",
    sub: "15.2375 COPE",
    val: "150.00",
    icon: "logo-bitcoin",
  },
  {
    id: 9,
    name: "STEP",
    sub: "45.1234 STEP",
    val: "100.00",
    icon: "logo-bitcoin",
  },
  {
    id: 10,
    name: "RAY",
    sub: "3.4567 RAY",
    val: "80.00",
    icon: "logo-bitcoin",
  },
  {
    id: 11,
    name: "MANGO",
    sub: "1.2345 MANGO",
    val: "60.00",
    icon: "logo-bitcoin",
  },
];

export const SwapScreen = () => {
  const router = useRouter();
  const [isModalVisible, setModalVisible] = React.useState<boolean>(false);
  const [isSlippageVisible, setSlippageVisible] =
    React.useState<boolean>(false);
  const [slippage, setSlippage] = React.useState<string>("0.50");

  const [selectedToken, setSelectedToken] = React.useState<TokenAsset>(
    ASSETS[0],
  );
  const [selectedPercent, setSelectedPercent] = React.useState<string | null>(
    null,
  );

  const percentageOptions = ["25%", "50%", "75%", "MAX"];

  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons
              name="chevron-back"
              size={28}
              color={Theme.colors.surface}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Swap</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.container}>
          {/* Select Section */}
          <View style={styles.bigCard}>
            <TouchableOpacity>
              <View style={styles.iconCircle}>
                <FontAwesome
                  name="repeat"
                  size={20}
                  color={Theme.colors.surface}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSlippageVisible(true)}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                  name="timer-settings-outline"
                  size={20}
                  color={Theme.colors.surface}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Select Section */}
          <GlassCard style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.label}>From:</Text>
              <View style={styles.balanceRow}>
                <Ionicons
                  name="wallet-outline"
                  size={18}
                  color={Theme.colors.surface}
                />
                <Text style={styles.balanceText}>5 SOL</Text>
              </View>
            </View>

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.tokenSelector}
                onPress={() => setModalVisible(true)}
              >
                <View style={styles.tokenIcon}>
                  <Ionicons
                    name={selectedToken.icon}
                    size={28}
                    color={Theme.colors.onSurface}
                  />
                </View>
                <Text style={styles.tokenName}>{selectedToken.name}</Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={24}
                  color={Theme.colors.surface}
                />
              </TouchableOpacity>

              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={Theme.colors.surface}
                keyboardType="numeric"
              />
            </View>

            <FlatList
              data={percentageOptions}
              horizontal
              scrollEnabled={false}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.percentRow}
              renderItem={({ item }) => (
                <Button
                  title={item}
                  variant={selectedPercent === item ? "solid" : "outline"}
                  color="v300"
                  onPress={() => setSelectedPercent(item)}
                  style={styles.percentButton}
                  textColor={selectedPercent === item ? "g300" : "v100"}
                />
              )}
            />
          </GlassCard>

          {/* Swap Arrow Button */}
          <View style={styles.arrowContainer}>
            <View style={styles.arrowButton}>
              <Ionicons name="arrow-down" size={32} color="white" />
            </View>
          </View>

          {/* USDT Section */}
          <GlassCard style={styles.card}>
            <View style={styles.usdtHeaderRow}>
              <Text style={styles.label}>To:</Text>
              <View style={styles.balanceRow}>
                <Ionicons
                  name="wallet-outline"
                  size={18}
                  color={Theme.colors.surface}
                />
                <Text style={styles.balanceText}>500 USDT</Text>
              </View>
            </View>

            <View style={styles.row}>
              <TouchableOpacity style={styles.tokenSelector}>
                <Image
                  source={require("@/assets/images/usdt-icon.png")}
                  style={styles.tokenIcon}
                />
                <Text style={styles.tokenName}>USDT</Text>
              </TouchableOpacity>
              <Text style={styles.amountInput}>172.587371</Text>
            </View>

            <Text style={styles.rateText}>{`1 USDT ≈ 0.0072 SOL`}</Text>
          </GlassCard>

          {/* Swap Button */}
          <Button
            title="Swap"
            variant="solid"
            onPress={() => router.push("/confirmSwap")}
            style={styles.swapButton}
            textColor="onSurface"
          />
        </View>

        <TokenSelectModal
          visible={isModalVisible}
          tokens={ASSETS}
          onClose={() => setModalVisible(false)}
          onSelect={setSelectedToken}
        />

        <SlippageModal
          visible={isSlippageVisible}
          slippage={slippage}
          onConfirm={setSlippage}
          onClose={() => setSlippageVisible(false)}
        />
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: Theme.fontSize.h5,
    fontWeight: 700,
    color: Theme.colors.surface,
  },
  container: {
    paddingHorizontal: 16,
    marginTop: 30,
  },
  bigCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 5,
    paddingBottom: 16,
  },
  card: {
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  label: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textL,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  tokenSelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  tokenIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: Theme.colors.g50,
  },
  tokenName: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "500",
    marginRight: 4,
  },
  amountInput: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h5,
    fontWeight: "700",
    textAlign: "right",
    flex: 1,
  },
  arrowContainer: {
    alignItems: "center",
    marginVertical: -15,
    zIndex: 10,
  },
  arrowButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.v300,
    justifyContent: "center",
    alignItems: "center",
  },
  usdtHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
    marginLeft: 8,
  },
  swapButton: {
    backgroundColor: Theme.colors.v300,
    width: "100%",
    paddingVertical: 10,
    marginTop: 20,
  },
  mainWrapperCard: {
    padding: 16,
    borderRadius: 32,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderWidth: 1,
  },
  percentRow: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 16,
  },
  percentButton: {
    flex: 1,
    minWidth: 75,
    paddingVertical: 6,
    paddingHorizontal: 0,
    borderRadius: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Theme.colors.glassBackground,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.glassBorder,
  },
  rateText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
    marginTop: 14,
  },
});
