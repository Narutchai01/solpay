import { useAuth } from "@/src/hooks/useAuth";
import { Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated } = useAuth();

  return <Redirect href={isAuthenticated ? "/(tabs)" : "/(auth)"} />;
}
