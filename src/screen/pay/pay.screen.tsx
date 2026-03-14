import { ConfirmModal } from "@/src/components/modal/Confirm";
import { Header } from "@/src/components/shard/header";
import { Theme } from "@/src/core/theme/theme";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const PayScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showInvalidQRModal, setShowInvalidQRModal] = useState(false);

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

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;

    const isPromptPay =
      data.startsWith("000201") && data.includes("A000000677");

    if (isPromptPay) {
      setScanned(true);
      router.replace({ pathname: "/transfer", params: { qrData: data } });
    } else {
      setScanned(true);
      setShowInvalidQRModal(true);
    }
  };

  const handleCloseInvalidQRModal = () => {
    setShowInvalidQRModal(false);
    setScanned(false);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        router.replace("/(tabs)");
      }
    } catch {
      alert("This image cannot be used. Please choose another one.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Camera */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={torch}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />

      {/* Overlay */}
      <View style={[styles.overlay, StyleSheet.absoluteFillObject]}>
        <SafeAreaView style={styles.safeArea}>
          <Header title="Transfer" />

          <View style={styles.mainContent}>
            <View style={styles.scanFrameContainer}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerActions}>
              <TouchableOpacity onPress={() => setTorch(!torch)}>
                <MaterialCommunityIcons
                  name={torch ? "flash" : "flash-off"}
                  style={styles.button}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={pickImage}>
                <MaterialIcons name="image" style={styles.button} />
              </TouchableOpacity>
            </View>

            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                Position the QR code in the center of the frame.
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ConfirmModal
        visible={showPermissionModal}
        iconName="camera-outline"
        title="Camera Access Required"
        description="We need your permission to use the camera to scan QR codes for your transactions."
        cancelLabel="Don't allow"
        confirmLabel="Confirm"
        onCancel={() => navigation.goBack()}
        onConfirm={handleConfirmPermission}
      />

      <ConfirmModal
        visible={showInvalidQRModal}
        iconName="alert-circle-outline"
        iconColor={Theme.colors.errorText}
        title="Apologize"
        description="The QR code information is invalid. Please check it and try again."
        confirmLabel="OK"
        onConfirm={handleCloseInvalidQRModal}
      />
    </View>
  );
};

export default PayScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.onSurface },
  overlay: { flex: 1 },
  safeArea: { flex: 1 },
  iconBtn: {
    padding: 5,
    position: "absolute",
    left: 20,
    zIndex: 10,
  },
  mainContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  scanFrameContainer: {
    width: width * 0.7,
    height: width * 0.7,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: Theme.colors.surface,
    borderWidth: 4,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  footer: { paddingBottom: 0 },
  footerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  button: {
    fontSize: 32,
    color: Theme.colors.surface,
  },
  instructionContainer: {
    backgroundColor: Theme.colors.surface,
    paddingVertical: 4,
    alignItems: "center",
  },
  instructionText: {
    color: Theme.colors.onSurface,
    fontSize: Theme.fontSize.textL,
  },
});
