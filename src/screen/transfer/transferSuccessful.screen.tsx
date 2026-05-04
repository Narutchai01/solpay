import { Button } from "@/src/components/button/button";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Header } from "@/src/components/shard/header";
import { LoadingSpinner } from "@/src/components/shard/loadingSpinner";
import { useTransaction } from "@/src/hooks/useTransaction";
import { useTransactionWs } from "@/src/hooks/useTransaction-ws";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../core/theme/theme";

export const TransferSuccessfulScreen = () => {
  const params = useLocalSearchParams<{
    from?: string;
    txUUID?: string | string[];
    txHash?: string | string[];
  }>();

  const isFromHistory = params.from === "history";

  const txUUID = React.useMemo(() => {
    const rawTxUUID = params.txUUID;
    if (Array.isArray(rawTxUUID)) {
      return rawTxUUID[0]?.trim() ?? "";
    }
    return rawTxUUID?.trim() ?? "";
  }, [params.txUUID]);

  const paramTxHash = React.useMemo(() => {
    const rawTxHash = params.txHash;
    if (Array.isArray(rawTxHash)) {
      return rawTxHash[0]?.trim() ?? "";
    }
    return rawTxHash?.trim() ?? "";
  }, [params.txHash]);

  const { GetWsTransaction, isCompleted } = useTransactionWs();
  const { GetTransactionByID, transaction } = useTransaction();

  const [isLoadingImage, setIsLoadingImage] = useState(false);

  useEffect(() => {
    // If we are from history or don't have a UUID to monitor, skip WS connection
    if (isFromHistory || !txUUID) return;

    const stopMonitoring = GetWsTransaction(txUUID);
    return () => {
      stopMonitoring();
    };
  }, [GetWsTransaction, txUUID, isFromHistory]);

  useEffect(() => {
    // We fetch immediately if from history (no WS needed)
    // If not from history, we wait for isCompleted event via WS.
    if (!txUUID) return;

    if (isFromHistory || isCompleted) {
      void GetTransactionByID(txUUID);
    }
  }, [GetTransactionByID, isCompleted, txUUID, isFromHistory]);

  const transactionByParam =
    transaction?.transaction_uuid === txUUID ? transaction : null;

  // Use txHash from database if available, fallback to router param
  const finalTxHash =
    transactionByParam?.transaction_on_chain?.tx_hash || paramTxHash;
  // Try to use the slip_url from database
  const finalSlipUrl = transactionByParam?.transaction_off_chain?.slip_url;

  const isDataLoading =
    (!transactionByParam && isFromHistory) || (!isFromHistory && !isCompleted);

  if (isDataLoading) {
    return (
      <GradientLayout>
        <SafeAreaView style={styles.loadingContainer}>
          <LoadingSpinner overlay={false} />
        </SafeAreaView>
      </GradientLayout>
    );
  }

  // Removed duplicate handleOpenExplorer
  const handleOpenExplorer = async () => {
    if (finalTxHash) {
      const url = `https://explorer.solana.com/tx/${finalTxHash}?cluster=devnet`;
      await WebBrowser.openBrowserAsync(url);
    }
  };

  return (
    <GradientLayout>
      {isLoadingImage && <LoadingSpinner overlay={true} />}

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainContent}>
          <View>
            <Header
              title={isFromHistory ? "Transfer Slip" : "Transfer Successful"}
              showBackButton={isFromHistory}
            />

            <View style={styles.successImageContainer}>
              {finalSlipUrl && (
                <Image
                  source={{ uri: finalSlipUrl }}
                  style={styles.successImage}
                  resizeMode="contain"
                  onLoadStart={() => setIsLoadingImage(true)}
                  onLoadEnd={() => setIsLoadingImage(false)}
                />
              )}
              {/*{finalSlipUrl ? (
                <Image
                  source={{ uri: finalSlipUrl }}
                  style={styles.successImage}
                  resizeMode="contain"
                  onLoadStart={() => setIsLoadingImage(true)}
                  onLoadEnd={() => setIsLoadingImage(false)}
                />
              ) : (
                <Image
                  source={require("@/assets/images/transferSuccessful-image.png")}
                  style={styles.successImage}
                  resizeMode="contain"
                />
              )}*/}
            </View>
            {finalTxHash && (
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

          {!isFromHistory && (
            <View style={styles.buttonContainer}>
              <Button
                title="Done"
                variant="solid"
                color="v300"
                onPress={() => router.replace("/(tabs)")}
                textColor="g300"
                style={styles.doneButton}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  successImageContainer: {
    paddingHorizontal: 16,
    marginTop: 40,
  },
  successImage: {
    width: "100%",
    height: 500,
  },
  explorerLinkContainer: {
    marginTop: 16,
    alignItems: "flex-start",
    paddingLeft: 16,
  },
  explorerLinkText: {
    color: Theme.colors.v300,
    fontSize: Theme.fontSize.textM,
    textDecorationLine: "underline",
  },
  buttonContainer: {
    paddingHorizontal: 16,
  },
  doneButton: {
    paddingVertical: 10,
  },
});
