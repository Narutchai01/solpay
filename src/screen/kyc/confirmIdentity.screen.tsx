import { Button } from "@/src/components/button/button";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../core/theme/theme";

export const ConfirmIdentityKYCScreen = () => {
  const router = useRouter();

  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          {/* Image Section */}
          <View style={styles.imageContainer}>
            <Image
              source={require("@/assets/images/confirmIdentityKYC.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* Texts */}
          <Text style={styles.title}>{`Confirm your identity`}</Text>
          <Text style={styles.subtitle}>
            {`We'll ask for your ID and a selfie. It's quick and secure, and
            trusted by millions of users worldwide.`}
          </Text>

          {/* Button */}
          <Button
            title="Let's go"
            variant="solid"
            color="v300"
            onPress={() => {
              router.push("/");
            }}
            style={styles.button}
            textColor="g300"
          />
        </View>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
  },
  imageContainer: {
    width: "100%",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h5,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h7,
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  button: {
    width: "100%",
  },
});
