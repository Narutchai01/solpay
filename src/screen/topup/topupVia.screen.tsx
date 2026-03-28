import { Button } from "@/src/components/button/button";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Header } from "@/src/components/shard/header";
import { Theme } from "@/src/core/theme/theme";
import { CreateQuoteRequest } from "@/src/domain/model/quote";
import { useQuote } from "@/src/hooks/useQuote";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BalanceCardComponent } from "./balanceCard.component";

const PRESET_AMOUNTS = [200, 500, 1000, 2000];

export const TopupViaScreen = () => {
  const { createQuote, quote } = useQuote();
  const [reqQuote, setReqQuote] = useState<CreateQuoteRequest>({
    thb_amount: 0,
    action_type: "TOPUP",
  });

  const handleAmountChange = (value: number) => {
    const normalizedValue = value;
    const parsedValue = Number(normalizedValue);

    setReqQuote((prev) => ({
      ...prev,
      thb_amount: Number.isNaN(parsedValue) ? 0 : parsedValue,
    }));
  };

  const renderPresetItem = (item: number) => {
    const isSelected = reqQuote.thb_amount === item;

    return (
      <TouchableOpacity
        style={[styles.presetButton, isSelected && styles.presetButtonActive]}
        onPress={() => handleAmountChange(item)}
      >
        <Text
          style={[styles.presetText, isSelected && styles.presetTextActive]}
        >
          {item.toLocaleString()} THB
        </Text>
      </TouchableOpacity>
    );
  };

  console.log("Quote:", quote);

  return (
    <GradientLayout>
      <SafeAreaView style={styles.container}>
        <Header title="Top up via SolPay" />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
        >
          <View style={styles.contentWrapper}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <BalanceCardComponent
                label="Software Wallet"
                mainAmount="617.57"
                mainCurrency="USDT"
                subAmount="20,000"
                subCurrency="THB"
                showTopUp={false}
              />

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Amount</Text>
                <View style={styles.largeInputContainer}>
                  <TextInput
                    style={styles.largeInput}
                    value={reqQuote.thb_amount.toLocaleString()}
                    onChangeText={(value) => handleAmountChange(Number(value))}
                    placeholder="0"
                    placeholderTextColor={Theme.colors.g100}
                    keyboardType="numeric"
                  />

                  <Text style={styles.largeInput}> THB</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailText}>USDT Amount :</Text>
                  <Text style={styles.detailText}>
                    {reqQuote.thb_amount} THB
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailText}>Min :</Text>
                  <Text style={styles.detailText}>1 USDT</Text>
                </View>

                <Text style={styles.exchangeRateText}>1 USDT = 32.39 THB</Text>

                <View style={styles.presetContainer}>
                  <FlatList
                    data={PRESET_AMOUNTS}
                    renderItem={({ item }) => renderPresetItem(item)}
                    keyExtractor={(item) => item.toString()}
                    horizontal
                    scrollEnabled={false}
                    contentContainerStyle={styles.presetListContainer}
                    style={styles.flatListWrapper}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Button
                title="Next"
                color="v300"
                style={styles.nextButton}
                onPress={() => createQuote(reqQuote)}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  inputSection: {
    marginTop: 40,
    alignItems: "center",
  },
  inputLabel: {
    color: Theme.colors.g50,
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
    marginBottom: 20,
  },
  largeInputContainer: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  largeInput: {
    color: Theme.colors.surface,
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  detailText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
  },
  exchangeRateText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
    alignSelf: "flex-start",
    marginTop: 8,
    marginBottom: 24,
  },
  flatListWrapper: {
    width: "100%",
  },
  presetListContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  presetButton: {
    borderWidth: 1.5,
    borderColor: Theme.colors.v300,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "transparent",
    minWidth: 85,
  },
  presetContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 32,
  },
  presetButtonActive: {
    backgroundColor: Theme.colors.v300,
  },
  presetText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
    fontWeight: "600",
  },
  presetTextActive: {
    color: Theme.colors.g300,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  nextButton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
});
