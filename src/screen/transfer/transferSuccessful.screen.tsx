import { Button } from "@/src/components/button/button";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Header } from "@/src/components/shard/header";
import { LoadingSpinner } from "@/src/components/shard/loadingSpinner";
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../core/theme/theme";

export const TransferSuccessfulScreen = () => {
  const params = useLocalSearchParams();
  const isFromHistory = params.from === "history";
  const slipUrl = params.slipUrl as string | undefined;
  const txHash = params.txHash as string | undefined;

  const [isLoading, setIsLoading] = useState(!!slipUrl);

  const handleOpenExplorer = async () => {
    if (txHash) {
      const url = `https://explorer.solana.com/tx/${txHash}?cluster=devnet`;
      await WebBrowser.openBrowserAsync(url);
    }
  };

  return (
    <GradientLayout>
      {isLoading && <LoadingSpinner overlay={true} />}

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainContent}>
          <View>
            <Header
              title={isFromHistory ? "Transfer Slip" : "Transfer Successful"}
              showBackButton={isFromHistory}
            />

            <View style={styles.successImageContainer}>
              {slipUrl ? (
                <Image
                  source={{ uri: slipUrl }}
                  style={styles.successImage}
                  resizeMode="contain"
                  onLoadStart={() => setIsLoading(true)}
                  onLoadEnd={() => setIsLoading(false)}
                />
              ) : (
                <Image
                  source={require("@/assets/images/transferSuccessful-image.png")}
                  style={styles.successImage}
                  resizeMode="contain"
                />
              )}
            </View>
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

          {!isFromHistory && (
            <View style={styles.buttonContainer}>
              <Button
                title="Done"
                variant="solid"
                color="v300"
                onPress={() => router.replace("/(tabs)")}
                textColor="g300"
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
});
