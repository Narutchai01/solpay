import { ConfirmModal } from "@/src/components/modal/Confirm";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { PinService } from "@/src/core/services/pin.service";
import { Theme } from "@/src/core/theme/theme";
import { useAuth } from "@/src/hooks/useAuth";
import { useAuthStore } from "@/src/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeypadSection } from "./keypadSection.component";
import { PinDots } from "./pinDots";

const PIN_LENGTH = 6;

export const PinScreen = () => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const scale = SCREEN_WIDTH / 375;

  const navigation = useNavigation();
  const { account } = useAuth();
  const checkPin = useAuthStore((state) => state.checkPin);
  const [pin, setPin] = useState<string>("");
  const [step, setStep] = useState<"SET" | "CONFIRM">("SET");
  const [tempPin, setTempPin] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const walletAddress = account?.publicKey?.toBase58();

  const dynamicStyles = useMemo(
    () => ({
      closeButton: {
        top: 44 * scale,
        right: 24 * scale,
      },
      closeIcon: {
        fontSize: 28 * scale,
      },
      header: {
        marginTop: 40 * scale,
      },
      title: {
        fontSize: Math.min(Theme.fontSize.h5, 20 * scale),
        marginBottom: 12 * scale,
      },
      subtitle: {
        fontSize: Math.min(Theme.fontSize.textL, 16 * scale),
      },
      errorText: {
        fontSize: Math.min(Theme.fontSize.textL, 16 * scale),
        marginBottom: 10 * scale,
      },
      container: {
        paddingVertical: 20 * scale,
      },
    }),
    [scale],
  );

  const handlePress = (num: string) => {
    if (pin.length < PIN_LENGTH) {
      setPin((prev) => prev + num);
      setErrorMessage("");
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    const processPin = async () => {
      if (pin.length === PIN_LENGTH) {
        if (step === "SET") {
          setTempPin(pin);
          setStep("CONFIRM");
          setPin("");
        } else if (step === "CONFIRM") {
          if (pin === tempPin) {
            if (walletAddress) {
              await PinService.savePin(walletAddress, pin);
              await checkPin(walletAddress);
              setIsSuccessModalVisible(true);
            } else {
              setErrorMessage("Wallet not connected.");
              setPin("");
            }
          } else {
            setErrorMessage("The PIN does not match. Please try again.");
            setPin("");
          }
        }
      }
    };
    processPin();
  }, [pin, step, tempPin, checkPin, walletAddress]);

  const handleConfirmSuccess = () => {
    setIsSuccessModalVisible(false);
    router.replace("/(tabs)");
  };

  return (
    <GradientLayout>
      <SafeAreaView style={[styles.container, dynamicStyles.container]}>
        {/* Close Button */}
        <TouchableOpacity
          style={[styles.closeButton, dynamicStyles.closeButton]}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
        >
          <Ionicons
            name="close"
            style={[styles.closeIcon, dynamicStyles.closeIcon]}
          />
        </TouchableOpacity>

        {/* Header Section */}
        <View style={[styles.header, dynamicStyles.header]}>
          <Text style={[styles.title, dynamicStyles.title]}>
            {step === "SET" ? "Set your PIN" : "Confirm your PIN"}
          </Text>
          <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
            {step === "SET"
              ? "Enter a 6-digit PIN to secure your account."
              : "Please confirm your 6-digit PIN."}
          </Text>
        </View>

        {/* Pin Display */}
        <PinDots pinLength={PIN_LENGTH} currentLength={pin.length} />

        {/* Error Message */}
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, dynamicStyles.errorText]}>
              {errorMessage}
            </Text>
          </View>
        ) : null}

        {/* Custom Keypad */}
        <View style={styles.keypadContainer}>
          <KeypadSection onPress={handlePress} onDelete={handleDelete} />
        </View>

        <ConfirmModal
          visible={isSuccessModalVisible}
          title="PIN Set Successfully!"
          description="Your account is now secured with a 6-digit PIN."
          iconName="checkmark-circle"
          iconSize={80 * scale}
          iconColor={Theme.colors.success}
          confirmLabel="Done"
          onConfirm={handleConfirmSuccess}
        />
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  closeButton: {
    position: "absolute",
    zIndex: 10,
  },
  closeIcon: {
    color: "white",
  },
  header: {
    alignItems: "center",
  },
  title: {
    color: "white",
    fontWeight: "bold",
  },
  subtitle: {
    color: Theme.colors.surface,
    textAlign: "center",
  },
  errorContainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: Theme.colors.errorText,
    textAlign: "center",
  },
  keypadContainer: {
    flex: 1,
    width: "85%",
    justifyContent: "center",
    marginBottom: 40,
  },
});
