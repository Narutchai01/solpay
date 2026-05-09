import { ConfirmModal } from "@/src/components/modal/Confirm";
import { Header } from "@/src/components/shard/header";
import { Theme } from "@/src/core/theme/theme";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IdCardScanScreen() {
  const router = useRouter();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const [step, setStep] = useState<"FRONT" | "BACK">("FRONT");
  const [frontImage, setFrontImage] = useState<string | null>(null);

  // Responsive scaling factors
  const scale = SCREEN_WIDTH / 375; // Based on standard iPhone width
  const frameWidth = SCREEN_WIDTH * 0.9;
  const frameHeight = SCREEN_WIDTH * 0.58;

  const dynamicStyles = useMemo(
    () => ({
      instructionContainer: {
        marginTop: 20 * scale,
      },
      instructionText: {
        fontSize: Math.max(14, Math.min(Theme.fontSize.textL, 16 * scale)),
        paddingHorizontal: 20 * scale,
        paddingVertical: 10 * scale,
        borderRadius: 20 * scale,
      },
      idCardFrame: {
        width: frameWidth,
        height: frameHeight,
      },
      corner: {
        width: 30 * scale,
        height: 30 * scale,
        borderWidth: 4 * scale,
      },
      bottomSection: {
        paddingHorizontal: 30 * scale,
        paddingBottom: Math.max(20, 50 * (SCREEN_HEIGHT / 812)),
      },
      captureOuterRing: {
        width: 70 * scale,
        height: 70 * scale,
        borderRadius: 35 * scale,
        borderWidth: 4 * scale,
      },
      captureInnerCircle: {
        width: 52 * scale,
        height: 52 * scale,
        borderRadius: 26 * scale,
      },
    }),
    [scale, SCREEN_HEIGHT, frameWidth, frameHeight],
  );

  useEffect(() => {
    // Only show modal if permission is definitely not granted and we haven't asked yet
    if (
      permission &&
      !permission.granted &&
      permission.status === "undetermined"
    ) {
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

        <View
          style={[
            styles.instructionContainer,
            dynamicStyles.instructionContainer,
          ]}
        >
          <Text style={[styles.instructionText, dynamicStyles.instructionText]}>
            Please scan the <Text style={styles.boldText}>{step}</Text> of your
            ID Card
          </Text>
        </View>

        <View style={styles.maskContainer}>
          <View style={[styles.idCardFrame, dynamicStyles.idCardFrame]}>
            <View
              style={[styles.corner, styles.topLeft, dynamicStyles.corner]}
            />
            <View
              style={[styles.corner, styles.topRight, dynamicStyles.corner]}
            />
            <View
              style={[styles.corner, styles.bottomLeft, dynamicStyles.corner]}
            />
            <View
              style={[styles.corner, styles.bottomRight, dynamicStyles.corner]}
            />
          </View>
        </View>

        <View style={[styles.bottomSection, dynamicStyles.bottomSection]}>
          <View style={styles.captureContainer}>
            <TouchableOpacity
              style={[styles.captureOuterRing, dynamicStyles.captureOuterRing]}
              onPress={takePicture}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.captureInnerCircle,
                  dynamicStyles.captureInnerCircle,
                ]}
              />
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
  },
  instructionText: {
    color: "white",
    backgroundColor: "rgba(0,0,0,0.5)",
    overflow: "hidden",
    textAlign: "center",
  },
  boldText: { fontWeight: "800", color: Theme.colors.v300 },
  maskContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  idCardFrame: {
    position: "relative",
  },
  corner: {
    position: "absolute",
    borderColor: Theme.colors.surface,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  bottomSection: {},
  captureContainer: { alignItems: "center", marginBottom: 30 },
  captureOuterRing: {
    borderColor: Theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  captureInnerCircle: {
    backgroundColor: Theme.colors.surface,
  },
});
