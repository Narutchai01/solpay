import { GlassCard } from "@/src/components/card/glass";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Theme } from "../../core/theme/theme";

interface AssetItemProps {
  item: {
    name: string;
    sub: string;
    val: string;
    icon: string;
  };
}

export const AssetItem = ({ item }: AssetItemProps) => {
  return (
    <GlassCard style={styles.assetCard}>
      <View style={styles.assetInner}>
        <View style={styles.assetLeft}>
          <View style={styles.iconWrapper}>
            <Ionicons
              name={item.icon as any}
              size={24}
              color={Theme.colors.surface}
            />
          </View>

          <View>
            <Text style={styles.assetName}>{item.name}</Text>
            <Text style={styles.assetSub}>{item.sub}</Text>
          </View>
        </View>

        <Text style={styles.assetValue}>{item.val} THB</Text>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  assetCard: {
    marginBottom: 16,
  },
  assetInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  assetLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  assetName: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h7,
    fontWeight: "semibold",
  },
  assetSub: {
    color: Theme.colors.g50,
    fontSize: Theme.fontSize.textS,
    marginTop: 4,
  },
  assetValue: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h7,
    fontWeight: "semibold",
  },
});
