import { ConfirmModal } from "@/src/components/modal/Confirm";
import { Header } from "@/src/components/shard/header";
import { Theme } from "@/src/core/theme/theme";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function FaceScanScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  useEffect(() => {
    if (permission) {
      if (!permission.granted && permission.canAskAgain) {
        setShowPermissionModal(true);
      }
    }
  }, [permission]);

  const handleConfirmPermission = async () => {
    const { granted } = await requestPermission();

    if (granted) {
      setShowPermissionModal(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="front"
      />

      <SafeAreaView style={styles.overlay}>
        {/* Header */}
        <Header title="Camera" />

        {/* Face Mask */}
        <View style={styles.faceMaskContainer}>
          <View style={styles.faceOvalMask} />
        </View>

        <View style={styles.bottomSection}>
          {/* Instructions */}
          <View style={styles.instructionBox}>
            <Text style={styles.instructionTitle}>
              Advice for Face Scanning
            </Text>
            <Text style={styles.instructionText}>
              1. Look at your face in a bright light.
            </Text>
            <Text style={styles.instructionText}>
              2. Choose a simple background and
            </Text>
            <Text style={styles.instructionText}>
              3. make sure nothing is blocking your face.
            </Text>
            <Text style={styles.instructionText}>
              Make sure your face is in the allotted frame.
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ConfirmModal
        visible={showPermissionModal}
        iconName="camera-outline"
        title="Camera Access Required"
        description="We need your permission to use the camera to scan your face."
        cancelLabel="Don't allow"
        confirmLabel="Confirm"
        onCancel={() => navigation.goBack()}
        onConfirm={handleConfirmPermission}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.g500,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
  },
  faceMaskContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  faceOvalMask: {
    width: width * 0.75,
    height: width * 1.1,
    borderRadius: 200,
    borderWidth: 3,
    borderColor: Theme.colors.surface,
    borderStyle: "dashed",
  },
  bottomSection: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  instructionBox: {
    gap: 4,
  },
  instructionTitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textL,
    fontWeight: "600",
    marginBottom: 4,
  },
  instructionText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
    fontWeight: "400",
    lineHeight: 20,
  },
});
