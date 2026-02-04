import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Theme } from "@/src/core/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeypadSection } from "./keypadSection.component";
import { PinDots } from "./pinDots";

const PIN_LENGTH = 6;

export const PinScreen = () => {
  const navigation = useNavigation();
  const [pin, setPin] = useState<string>("");
  const [step, setStep] = useState<"SET" | "CONFIRM">("SET");
  const [tempPin, setTempPin] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

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
    if (pin.length === PIN_LENGTH) {
      if (step === "SET") {
        setTempPin(pin);
        setStep("CONFIRM");
        setPin("");
      } else if (step === "CONFIRM") {
        if (pin === tempPin) {
          alert("PIN Set Successfully!");
        } else {
          setErrorMessage("The PIN does not match. Please try again.");
          setPin("");
        }
      }
    }
  }, [pin, step, tempPin]);

  return (
    <GradientLayout>
      <SafeAreaView style={styles.container}>
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
        >
          <Ionicons name="close" style={styles.closeIcon} />
        </TouchableOpacity>

        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {step === "SET" ? "Set your PIN" : "Confirm your PIN"}
          </Text>
          <Text style={styles.subtitle}>
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
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Custom Keypad */}
        <View style={styles.keypadContainer}>
          <KeypadSection onPress={handlePress} onDelete={handleDelete} />
        </View>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 20,
  },
  closeButton: {
    position: "absolute",
    top: 24,
    right: 24,
    padding: 10,
    zIndex: 10,
  },
  closeIcon: {
    color: "white",
    fontSize: 28,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    color: "white",
    fontSize: Theme.fontSize.h5,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textL,
    textAlign: "center",
  },
  errorContainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: Theme.colors.errorText,
    fontSize: Theme.fontSize.textL,
    textAlign: "center",
    marginBottom: 10,
  },
  keypadContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "85%",
    justifyContent: "center",
  },
});
