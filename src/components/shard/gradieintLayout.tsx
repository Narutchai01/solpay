import { Theme } from "@/src/theme/theme";
import { LinearGradient } from "expo-linear-gradient";
import { FC } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface GradientLayoutProps {
  colors?: string[];
  children: React.ReactNode;
}

const GradientLayout: FC<GradientLayoutProps> = (props) => {
  const { colors = Theme.colors.background, children } = props;
  const gradientColors =
    colors.length >= 2 ? colors : [...colors, colors[0] || "#000000"];
  return (
    <LinearGradient
      colors={gradientColors as [string, string, ...string[]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1, // สำคัญ: ต้องเต็มจอ
  },
  safeArea: {
    flex: 1, // สำคัญ: ขยายพื้นที่ทำงานให้เต็ม Gradient
  },
});

export default GradientLayout;
