import { GlassCard } from "@/src/components/card/glass";
import { Theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface AssetData {
  id: string;
  name: string;
  sub: string;
  val: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface AssetsComponentProps {
  assets: AssetData[];
}

const AssetItem = ({ name, sub, val, icon }: Omit<AssetData, "id">) => (
  <View style={styles.assetItem}>
    <View style={styles.assetLeft}>
      <View style={styles.assetIconBG}>
        <Ionicons name={icon} style={styles.iconSize} />
      </View>
      <View>
        <Text style={styles.assetNameText}>{name}</Text>
        <Text style={styles.assetSubText} numberOfLines={1}>
          {sub}
        </Text>
      </View>
    </View>
    <Text style={styles.assetValueText}>{val} THB</Text>
  </View>
);

export const AssetsComponent = ({ assets }: AssetsComponentProps) => {
  return (
    <GlassCard style={styles.assetsCard}>
      <View style={styles.assetsContent}>
        <View style={styles.assetsHeader}>
          <Text style={styles.assetsTitle}>Assets</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={assets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AssetItem
              name={item.name}
              sub={item.sub}
              val={item.val}
              icon={item.icon}
            />
          )}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  assetsCard: { marginTop: 32 },
  assetsContent: { padding: 20, paddingBottom: 10 },
  assetsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  assetsTitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h5,
    fontWeight: "bold",
  },
  viewAllText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textS,
    textDecorationLine: "underline",
  },
  assetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  assetLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  assetIconBG: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.colors.g300,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  assetNameText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h7,
    fontWeight: "medium",
  },
  assetSubText: {
    color: Theme.colors.g50,
    fontSize: Theme.fontSize.textS,
    marginTop: 2,
    maxWidth: 200,
  },
  assetValueText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h7,
    fontWeight: "medium",
  },
  iconSize: {
    fontSize: 24,
    color: Theme.colors.surface,
  },
});
