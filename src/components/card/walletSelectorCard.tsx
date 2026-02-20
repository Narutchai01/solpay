import { GlassCard } from "@/src/components/card/glass";
import { Theme } from "@/src/core/theme/theme";
import { WalletOption } from "@/src/core/type/wallet-option";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface WalletSelectorProps {
  wallets: WalletOption[];
  onWalletChange: (wallet: WalletOption) => void;
}

export const WalletSelectorCard = ({
  wallets,
  onWalletChange,
}: WalletSelectorProps) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(wallets[0]);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const selectWallet = (wallet: WalletOption) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedWallet(wallet);
    setExpanded(false);
    onWalletChange(wallet);
  };

  const renderIcon = (type: "solpay" | "software", size = 44) => {
    return type === "solpay" ? (
      <Ionicons
        name="phone-portrait-outline"
        size={size}
        color={Theme.colors.surface}
      />
    ) : (
      <MaterialCommunityIcons
        name="cube-outline"
        size={size}
        color={Theme.colors.surface}
      />
    );
  };

  const renderItem = ({ item }: { item: WalletOption }) => (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={() => selectWallet(item)}
    >
      <View style={styles.iconWrapper}>{renderIcon(item.type)}</View>
      <Text style={styles.optionText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <GlassCard style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.walletInfo}>
          <View style={styles.iconWrapper}>
            {renderIcon(selectedWallet.type)}
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.walletName}>{selectedWallet.name}</Text>
            {!expanded && selectedWallet.balance && (
              <Text style={styles.walletBalance}>
                Available Balance {selectedWallet.balance}
              </Text>
            )}
          </View>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={24}
          color={Theme.colors.surface}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.dropdownContent}>
          <FlatList
            data={wallets}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        </View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  cardContainer: { marginTop: 16, paddingHorizontal: 16, paddingVertical: 12 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 60,
  },
  walletInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconWrapper: { width: 44, alignItems: "center", marginRight: 12 },
  textWrapper: { justifyContent: "center" },
  walletName: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
  },
  walletBalance: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textM,
    marginTop: 4,
    opacity: 0.8,
  },
  dropdownContent: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.g50,
    paddingTop: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  optionText: { color: Theme.colors.surface, fontSize: Theme.fontSize.textL },
});
