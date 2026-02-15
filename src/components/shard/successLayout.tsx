import { Button } from "@/src/components/button/button";
import { GlassCard } from "@/src/components/card/glass";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import React from "react";
import {
    FlatList,
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../core/theme/theme";

export interface SuccessDetailItem {
  label: string;
  value: string;
}

interface SuccessLayoutProps {
  icon?: ImageSourcePropType;
  details: SuccessDetailItem[];
  buttonTitle?: string;
  onButtonPress: () => void;
  cardStyle?: ViewStyle;
}

const DetailRow = ({ label, value }: SuccessDetailItem) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

export const SuccessLayout = ({
  icon = require("@/assets/images/success-icon.png"),
  details,
  buttonTitle = "Done",
  onButtonPress,
  cardStyle,
}: SuccessLayoutProps) => {
  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Icon */}
          <Image
            source={icon}
            style={styles.successIcon}
            resizeMode="contain"
          />

          {/* Detail Card */}
          <GlassCard style={[styles.detailCard, cardStyle]}>
            <FlatList
              data={details}
              keyExtractor={(item, index) => `${item.label}-${index}`}
              renderItem={({ item }) => (
                <DetailRow label={item.label} value={item.value} />
              )}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </GlassCard>
        </View>

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={buttonTitle}
            variant="solid"
            color="v300"
            onPress={onButtonPress}
            style={styles.doneButton}
            textColor="g300"
          />
        </View>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  successIcon: {
    width: 125,
    height: 103,
    marginBottom: 32,
  },
  detailCard: {
    width: "100%",
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  rowLabel: {
    color: Theme.colors.g50,
    fontSize: Theme.fontSize.h6,
    fontWeight: "500",
  },
  rowValue: {
    color: Theme.colors.g50,
    fontSize: Theme.fontSize.h6,
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
    marginLeft: 10,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  doneButton: {
    paddingVertical: 10,
  },
});
