import { Theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { KeypadButton } from "./keypadButton.component";

interface KeypadSectionProps {
  onPress: (num: string) => void;
  onDelete: () => void;
}

export const KeypadSection = ({ onPress, onDelete }: KeypadSectionProps) => {
  const data = [
    { id: "1", value: "1" },
    { id: "2", value: "2" },
    { id: "3", value: "3" },
    { id: "4", value: "4" },
    { id: "5", value: "5" },
    { id: "6", value: "6" },
    { id: "7", value: "7" },
    { id: "8", value: "8" },
    { id: "9", value: "9" },
    { id: "10", value: "" },
    { id: "11", value: "0" },
    { id: "12", value: "delete" },
  ];

  const renderItem = ({ item }: { item: (typeof data)[0] }) => {
    return (
      <View style={styles.columnWrapper}>
        {item.value === "" ? (
          <View style={styles.keypadButtonPlaceholder} />
        ) : item.value === "delete" ? (
          <KeypadButton
            value={
              <Ionicons name="backspace-outline" style={styles.iconSize} />
            }
            isIcon
            onPress={onDelete}
          />
        ) : (
          <KeypadButton
            value={item.value}
            onPress={() => onPress(item.value)}
          />
        )}
      </View>
    );
  };
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={styles.keypadList}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  keypadList: {
    marginTop: 20,
    width: "100%",
  },
  columnWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  keypadButtonPlaceholder: {
    width: 75,
    height: 75,
  },
  iconSize: {
    fontSize: 44,
    color: Theme.colors.surface,
  },
});
