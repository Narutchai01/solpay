import React, { FC } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { Theme } from "../theme/theme";
import { Button } from "./Button";

interface ConfirmModalProps {
  title: string;
  cancelLabel?: string;
  confirmLabel?: string;
  visible: boolean;
  onCancel?: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: FC<ConfirmModalProps> = ({
  title,
  cancelLabel = "No",
  confirmLabel = "Yes",
  visible,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.buttonRow}>
            <Button
              title={cancelLabel}
              variant="outline"
              onPress={onCancel}
              style={styles.button}
            />
            <Button
              title={confirmLabel}
              variant="solid"
              onPress={onConfirm}
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Theme.colors.backdrop,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    backgroundColor: Theme.colors.surface,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: Theme.fontSize.h5,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: Theme.colors.g300,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: 12,
  },
});
