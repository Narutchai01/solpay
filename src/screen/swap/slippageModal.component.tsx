import { Button } from "@/src/components/button/button";
import { GlassCard } from "@/src/components/card/glass";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Theme } from "../../core/theme/theme";

interface SlippageModalProps {
  visible: boolean;
  onClose: () => void;
  slippage: string;
  onConfirm: (val: string) => void;
}

export const SlippageModal = ({
  visible,
  onClose,
  slippage,
  onConfirm,
}: SlippageModalProps) => {
  const [tempSlippage, setTempSlippage] = useState(slippage);

  const handleConfirm = () => {
    onConfirm(tempSlippage);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Set Slippage</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Input */}
          <GlassCard style={styles.inputCard} glassStyle={styles.lightGlass}>
            <Text style={styles.label}>Max slippage</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={tempSlippage}
                onChangeText={setTempSlippage}
                keyboardType="numeric"
                placeholder="0.50"
                placeholderTextColor={Theme.colors.onSurface}
              />
              <Text style={styles.percentSymbol}>%</Text>
            </View>
          </GlassCard>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <Button
              title="Cancel"
              variant="outline"
              color="v300"
              textColor="v500"
              onPress={onClose}
              style={styles.actionButton}
            />
            <Button
              title="Confirm"
              variant="solid"
              color="v300"
              textColor="g300"
              onPress={handleConfirm}
              style={[styles.actionButton, { marginLeft: 12 }]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 24,
    padding: 20,
    width: "100%",
  },
  lightGlass: {
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: Theme.fontSize.h6,
    fontWeight: "700",
    color: Theme.colors.g300,
  },
  inputCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 24,
  },
  label: {
    color: Theme.colors.g300,
    fontSize: Theme.fontSize.h7,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    color: Theme.colors.g300,
    fontSize: Theme.fontSize.h7,
    fontWeight: "600",
    textAlign: "right",
    minWidth: 40,
  },
  percentSymbol: {
    color: Theme.colors.g300,
    fontSize: Theme.fontSize.h7,
    fontWeight: "600",
    marginLeft: 2,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
  },
});
