import { GlassCard } from "@/src/components/card/glass";
import { Ionicons } from "@expo/vector-icons";
import React, { ComponentProps } from "react";
import {
    FlatList,
    ListRenderItem,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Theme } from "../../core/theme/theme";

export interface TokenAsset {
  id: number;
  name: string;
  sub: string;
  val: string;
  icon: ComponentProps<typeof Ionicons>["name"];
}

interface TokenSelectModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (token: TokenAsset) => void;
  tokens: TokenAsset[];
}

export const TokenSelectModal = ({
  visible,
  onClose,
  onSelect,
  tokens,
}: TokenSelectModalProps) => {
  const renderItem: ListRenderItem<TokenAsset> = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        onSelect(item);
        onClose();
      }}
    >
      <GlassCard style={styles.tokenItem}>
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={item.icon}
              size={28}
              color={Theme.colors.onSurface}
            />
          </View>

          <View style={styles.tokenInfo}>
            <Text style={styles.tokenName}>{item.name}</Text>
            <Text style={styles.tokenSubText}>{item.sub}</Text>
          </View>

          <Text style={styles.tokenValue}>{item.val} THB</Text>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select token</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Theme.colors.surface} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={tokens}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Theme.colors.backdrop,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Theme.colors.g300,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 20,
    height: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: Theme.fontSize.h6,
    fontWeight: 600,
    color: Theme.colors.surface,
  },
  tokenItem: {
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.colors.g50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenName: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h7,
    fontWeight: "500",
  },
  tokenSubText: {
    color: Theme.colors.g50,
    fontSize: Theme.fontSize.textS,
    marginTop: 2,
  },
  tokenValue: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h7,
    fontWeight: "500",
  },
});
