import { Button } from "@/src/components/button/button";
import { GlassCard } from "@/src/components/card/glass";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { DetailConfirmationCard } from "@/src/core/type/detail-confirmation-card.type";
import { FontAwesome5 } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../core/theme/theme";

interface SuccessLayoutProps {
  details: DetailConfirmationCard[];
  buttonTitle?: string;
  onButtonPress: () => void;
  cardStyle?: ViewStyle;
  txHash?: string;
}

const DetailRow = ({ label, value }: DetailConfirmationCard) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

export const SuccessLayout = ({
  details,
  buttonTitle = "Done",
  onButtonPress,
  cardStyle,
  txHash,
}: SuccessLayoutProps) => {
  const handleOpenExplorer = async () => {
    if (txHash) {
      const url = `https://explorer.solana.com/tx/${txHash}?cluster=devnet`;
      await WebBrowser.openBrowserAsync(url);
    }
  };

  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Icon */}
          <View style={styles.iconCircle}>
            <FontAwesome5 name="check" size={44} color={Theme.colors.surface} />
          </View>

          {/* Detail Card */}
          <GlassCard style={[styles.detailCard, cardStyle]}>
            <FlatList
              data={details}
              keyExtractor={(item, index) => `${item.label}-${index}`}
              renderItem={({ item }) => (
                <DetailRow label={item.label} value={item.value} />
              )}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </GlassCard>

          {txHash && (
            <TouchableOpacity
              onPress={handleOpenExplorer}
              style={styles.explorerLinkContainer}
            >
              <Text style={styles.explorerLinkText}>
                View on Solana Explorer
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={buttonTitle}
            variant="solid"
            color="v300"
            onPress={onButtonPress}
            textColor="g300"
          />
        </View>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  successIcon: {
    width: 125,
    height: 103,
    marginBottom: 32,
  },
  detailCard: {
    width: "100%",
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  rowLabel: {
    color: Theme.colors.g50,
    fontSize: Theme.fontSize.h6,
    fontWeight: "500",
  },
  rowValue: {
    color: Theme.colors.g50,
    fontSize: Theme.fontSize.h6,
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
    marginLeft: 10,
  },
  buttonContainer: {
    paddingHorizontal: 16,
  },
  iconCircle: {
    width: 85,
    height: 85,
    borderRadius: "50%",
    backgroundColor: Theme.colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 38,
    marginTop: 10,
  },
  explorerLinkContainer: {
    marginTop: 20,
    alignSelf: "flex-start",
  },
  explorerLinkText: {
    color: Theme.colors.v300,
    fontSize: Theme.fontSize.textM,
    textDecorationLine: "underline",
  },
});
