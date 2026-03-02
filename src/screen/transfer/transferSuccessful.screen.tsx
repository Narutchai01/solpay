import { Button } from "@/src/components/button/button";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Header } from "@/src/components/shard/header";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const TransferSuccessfulScreen = () => {
  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainContent}>
          <View>
            <Header title="Transfer Successful" showBackButton={false} />

            <View style={styles.successImageContainer}>
              <Image
                source={require("@/assets/images/transferSuccessful-image.png")}
                style={styles.successImage}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Done"
              variant="solid"
              color="v300"
              onPress={() => router.replace("/(tabs)")}
              style={styles.doneButton}
              textColor="g300"
            />
          </View>
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
  buttonContainer: {
    paddingHorizontal: 16,
  },
  doneButton: {
    paddingVertical: 10,
  },
});
