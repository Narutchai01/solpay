import { Redirect } from "expo-router";
import { useAuth } from "../../src/hooks/useAuth";
import { PinScreen } from "../../src/screen/pin/pin.screen";

export default function Pin() {
  const { hasPin, isInitialized } = useAuth();

  if (!isInitialized) return null;

  if (hasPin) {
    return <Redirect href="/(tabs)" />;
  }

  return <PinScreen />;
}
