import { Theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    ImageSourcePropType,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface ConfirmModalProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  imageSource?: ImageSourcePropType;
  imageStyle?: { width?: number; height?: number };
  title: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  visible: boolean;
  onCancel?: () => void;
  onConfirm: () => void;
}

export const ConfirmModal = ({
  iconName,
  iconSize = 80,
  imageSource,
  imageStyle,
  title,
  description,
  cancelLabel,
  confirmLabel = "Confirm",
  visible,
  onCancel,
  onConfirm,
}: ConfirmModalProps) => {
  const hasOtherContent = iconName || imageSource || description;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.centeredView}>
        <View style={[styles.modalView, !hasOtherContent && { padding: 24 }]}>
          {/* Image or Icon */}
          {imageSource ? (
            <Image
              source={imageSource}
              style={[styles.topImage, imageStyle]}
              resizeMode="contain"
            />
          ) : iconName ? (
            <Ionicons
              name={iconName}
              size={iconSize}
              color="black"
              style={styles.icon}
            />
          ) : null}

          <Text
            style={[
              styles.modalTitle,
              !hasOtherContent && { marginBottom: 28 },
            ]}
          >
            {title}
          </Text>

          {description && (
            <Text style={styles.modalDescription}>{description}</Text>
          )}

          <View style={styles.buttonGroup}>
            {onCancel && cancelLabel && (
              <TouchableOpacity
                onPress={onCancel}
                style={[styles.button, styles.buttonOutline]}
              >
                <Text style={styles.textOutline}>{cancelLabel}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={onConfirm}
              style={[
                styles.button,
                styles.buttonSolid,
                !onCancel && { width: "100%" },
              ]}
            >
              <Text style={styles.textSolid}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.colors.disabled,
  },
  modalView: {
    width: "85%",
    backgroundColor: Theme.colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  topImage: { width: 140, height: 120, marginBottom: 20 },
  icon: { marginBottom: 20 },
  modalTitle: {
    fontSize: Theme.fontSize.h5,
    fontWeight: "bold",
    color: Theme.colors.g300,
    marginBottom: 10,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: Theme.fontSize.h7,
    color: Theme.colors.g300,
    textAlign: "center",
    marginBottom: 25,
  },
  buttonGroup: { flexDirection: "row", width: "100%", gap: 12 },
  button: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonOutline: { borderWidth: 2, borderColor: Theme.colors.v300 },
  buttonSolid: { backgroundColor: Theme.colors.v300 },
  textOutline: {
    color: Theme.colors.v500,
    fontWeight: "semibold",
    fontSize: Theme.fontSize.h6,
  },
  textSolid: {
    color: Theme.colors.g300,
    fontWeight: "semibold",
    fontSize: Theme.fontSize.h6,
  },
});
