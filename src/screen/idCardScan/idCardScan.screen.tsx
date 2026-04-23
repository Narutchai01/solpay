import { ConfirmModal } from "@/src/components/modal/Confirm";
import { Header } from "@/src/components/shard/header";
import { Theme } from "@/src/core/theme/theme";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function IdCardScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const [step, setStep] = useState<"FRONT" | "BACK">("FRONT");
  const [frontImage, setFrontImage] = useState<string | null>(null);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      setShowPermissionModal(true);
    }
  }, [permission]);

  const handleConfirmPermission = async () => {
    const { granted } = await requestPermission();
    if (granted) setShowPermissionModal(false);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (!photo) return;

        if (step === "FRONT") {
          setFrontImage(photo.uri);
          setStep("BACK");
        } else {
          router.push({
            pathname: "/idCardDetail",
            params: {
              frontImageUri: frontImage,
              backImageUri: photo.uri,
            },
          });
        }
      } catch (error) {
        console.error("Failed to take picture:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
      />

      <SafeAreaView style={styles.overlay}>
        <Header title="Scan ID Card" />

        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Please scan the <Text style={styles.boldText}>{step}</Text> of your
            ID Card
          </Text>
        </View>

        <View style={styles.maskContainer}>
          <View style={styles.idCardFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.captureContainer}>
            <TouchableOpacity
              style={styles.captureOuterRing}
              onPress={takePicture}
              activeOpacity={0.7}
            >
              <View style={styles.captureInnerCircle} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ConfirmModal
        visible={showPermissionModal}
        title="Camera Access Required"
        description="We need your permission to use the camera to scan your ID Card."
        onCancel={() => router.back()}
        onConfirm={handleConfirmPermission}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.g500 },
  overlay: { flex: 1, justifyContent: "space-between" },
  instructionContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  instructionText: {
    color: "white",
    fontSize: Theme.fontSize.textL,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
  boldText: { fontWeight: "800", color: Theme.colors.v300 },
  maskContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  idCardFrame: {
    width: width * 0.9,
    height: width * 0.58,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: Theme.colors.surface,
    borderWidth: 4,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  bottomSection: { paddingHorizontal: 30, paddingBottom: 50 },
  captureContainer: { alignItems: "center", marginBottom: 30 },
  captureOuterRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: Theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  captureInnerCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Theme.colors.surface,
  },
});
