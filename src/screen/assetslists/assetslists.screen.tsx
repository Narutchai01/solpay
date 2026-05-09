import { AssetItem } from "@/src/components/assetitem/assetitem";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Header } from "@/src/components/shard/header";
import { useTokenAccounts } from "@/src/hooks/useTokenAccounts";
import { useHeaderHeight } from "@react-navigation/elements";
import { useFocusEffect } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../core/theme/theme";

const ListHeader = () => <Text style={styles.sectionTitle}>All Assets</Text>;

export const AssetsListsScreen = () => {
  const headerHeight = useHeaderHeight();
  const { assets, loading, fetchAssets } = useTokenAccounts();

  useFocusEffect(
    React.useCallback(() => {
      void fetchAssets();
    }, [fetchAssets]),
  );

  return (
    <GradientLayout>
      <SafeAreaView style={styles.container}>
        <Header title="Assets" />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Theme.colors.surface} />
          </View>
        ) : (
          <FlatList
            data={assets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AssetItem item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingTop: headerHeight + 20 },
            ]}
            ListHeaderComponent={ListHeader}
          />
        )}
      </SafeAreaView>
    </GradientLayout>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    marginTop: 20,
  },
  sectionTitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
