import { Redirect } from "expo-router";

export default function Index() {
  const auth = false;
  return auth ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)" />;
}
