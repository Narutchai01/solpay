import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PIN_LENGTH = 6;

interface KeypadButtonProps {
  value: string | React.ReactNode;
  onPress: () => void;
  isIcon?: boolean;
}

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

  const renderDots = () => {
    let dots = [];
    for (let i = 0; i < PIN_LENGTH; i++) {
      dots.push(
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor:
                i < pin.length ? Theme.colors.v300 : "transparent",
            },
          ]}
        />,
      );
    }
    return dots;
  };

  const KeypadButton = ({
    value,
    onPress,
    isIcon = false,
  }: KeypadButtonProps) => (
    <TouchableOpacity style={styles.keypadButton} onPress={onPress}>
      {isIcon ? value : <Text style={styles.keypadText}>{value}</Text>}
    </TouchableOpacity>
  );

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
        <View style={styles.dotsContainer}>{renderDots()}</View>

        {/* Error Message */}
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Custom Keypad */}
        <View style={styles.keypadContainer}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <KeypadButton
              key={num}
              value={num.toString()}
              onPress={() => handlePress(num.toString())}
            />
          ))}
          <View style={styles.keypadButton} />
          <KeypadButton value="0" onPress={() => handlePress("0")} />
          <KeypadButton
            value={
              <Ionicons name="backspace-outline" style={styles.deleteIcon} />
            }
            isIcon
            onPress={handleDelete}
          />
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
    paddingVertical: 50,
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
    marginBottom: 12,
  },
  subtitle: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textL,
    textAlign: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    marginVertical: 30,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Theme.colors.v300,
    marginHorizontal: 10,
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
  keypadButton: {
    width: "33.33%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  keypadText: {
    color: "white",
    fontSize: Theme.fontSize.h3,
    borderWidth: 1,
    borderColor: Theme.colors.surface,
    width: 75,
    height: 75,
    borderRadius: 50,
    textAlign: "center",
    lineHeight: 75,
  },
  deleteIcon: {
    color: "white",
    fontSize: 42,
  },
});
