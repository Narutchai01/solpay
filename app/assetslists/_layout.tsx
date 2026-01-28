import { Stack, Link } from "expo-router";
import { Theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";

export default function AssetsListsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerTintColor: Theme.colors.surface,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Assets",
          headerLeft: () => (
            <Link href="../" asChild>
              <Ionicons
                name="chevron-back-outline"
                size={24}
                color={Theme.colors.surface}
              />
            </Link>
          ),
        }}
      />
    </Stack>
  );
}
