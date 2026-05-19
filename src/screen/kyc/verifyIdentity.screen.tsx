import { Button } from "@/src/components/button/button";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Header } from "@/src/components/shard/header";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../core/theme/theme";

const ID_GUIDELINES = [
  "Use machine-readable documents.",
  "Ensure that your documents are valid and undamaged.",
  "Do not use screenshots or re-photographed images.",
  "Do not use expired documents.",
  "Do not hire or allow others to complete KYC on your behalf.",
];

export const VerifyIdentityScreen = () => {
  const router = useRouter();

  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        <Header title="KYC" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Image Section */}
          <View style={styles.imageContainer}>
            <Image
              source={require("@/assets/images/verifyIdentityKYC.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.mainTitle}>{`Verify Your Identity (KYC)`}</Text>
          <Text style={styles.subtitle}>
            {`Please submit the following documents to proceed with your
            application.`}
          </Text>

          {/* ID Card */}
          <View style={styles.instructionBlock}>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons
                name="card-account-details"
                size={38}
                color={Theme.colors.surface}
              />
            </View>
            <View style={styles.textWrapper}>
              <Text
                style={styles.stepTitle}
              >{`Take a photo of your ID card`}</Text>
              <Text style={styles.stepSubtitle}>
                {`To verify your personal information.`}
              </Text>
              <View style={styles.bulletContainer}>
                {ID_GUIDELINES.map((item, index) => (
                  <View key={index} style={styles.bulletRow}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Selfie */}
          <View style={[styles.instructionBlock, { marginTop: 24 }]}>
            <View style={styles.iconWrapper}>
              <Ionicons name="camera" size={38} color={Theme.colors.surface} />
            </View>
            <View style={styles.textWrapper}>
              <Text
                style={styles.stepTitle}
              >{`Take a selfie of your face.`}</Text>
              <Text style={styles.stepSubtitle}>
                {`To match your face with the photo on your passport or national ID card.`}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer Section */}
        <View style={styles.footerContainer}>
          <View style={styles.securityNotice}>
            <Ionicons
              name="lock-closed"
              size={14}
              color={Theme.colors.surface}
            />
            <Text style={styles.securityText}>
              {`Encrypted and securely stored.`}
            </Text>
          </View>

          <Button
            title="Start"
            variant="solid"
            color="v300"
            onPress={() => {
              router.push("/idCardScan");
            }}
            style={styles.startButton}
            textColor="g300"
          />
        </View>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    height: 200,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  mainTitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h5,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h7,
    fontWeight: "400",
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 32,
  },
  instructionBlock: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  textWrapper: {
    flex: 1,
  },
  stepTitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
    marginBottom: 4,
  },
  stepSubtitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
    lineHeight: 20,
    marginBottom: 12,
  },
  bulletContainer: {
    paddingRight: 10,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  bulletPoint: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textL,
    marginRight: 8,
    marginTop: 2,
    lineHeight: 14,
  },
  bulletText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textS,
    flex: 1,
  },
  footerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  securityNotice: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  securityText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textS,
    marginLeft: 6,
  },
  startButton: {
    width: "100%",
    paddingVertical: 10,
  },
});
