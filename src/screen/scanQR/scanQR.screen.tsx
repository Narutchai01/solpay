import { ConfirmModal } from "@/src/components/modal/Confirm";
import { Theme } from "@/src/theme/theme";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
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

const ScanQRScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) return <View style={styles.container} />;

  const handleConfirm = async () => {
    const { granted } = await requestPermission();
    if (granted) {
      setShowModal(false);
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    router.replace({ pathname: "/(tabs)", params: { qrData: data } });
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
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.iconBtn}
            >
              <Ionicons name="chevron-back" style={styles.button} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Transfer</Text>
          </View>

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
        visible={!permission.granted || showModal}
        iconName="camera-outline"
        title="Camera Access Required"
        description="We need your permission to use the camera to scan QR codes for your transactions."
        cancelLabel="Don't allow"
        confirmLabel="Confirm"
        onCancel={() => navigation.goBack()}
        onConfirm={handleConfirm}
      />
    </View>
  );
};

export default ScanQRScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.onSurface },
  overlay: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    height: 60,
    position: "relative",
  },
  iconBtn: {
    padding: 5,
    position: "absolute",
    left: 20,
    zIndex: 10,
  },
  headerTitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h5,
    textAlign: "center",
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
    color: "black",
    fontSize: Theme.fontSize.textL,
  },
  permissionContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  permissionTitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h4,
    marginBottom: 10,
  },
  permissionText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textL,
    textAlign: "center",
    marginBottom: 30,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 15,
  },
  permissionBtn: {
    flex: 1,
    backgroundColor: Theme.colors.v300,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 140,
  },
  permissionBtnText: {
    color: Theme.colors.g300,
    fontSize: Theme.fontSize.h6,
  },
  cancelBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Theme.colors.surface,
  },
  cancelBtnText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
  },
  cameraIcon: {
    color: Theme.colors.surface,
    fontSize: 80,
    marginBottom: 20,
  },
});
