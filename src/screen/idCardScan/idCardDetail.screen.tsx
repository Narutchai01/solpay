import { Button } from "@/src/components/button/button";
import { Dropdown } from "@/src/components/button/dropdown";
import { GlassCard } from "@/src/components/card/glass";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Header } from "@/src/components/shard/header";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../core/theme/theme";

interface UnderlineDropdownProps {
  label: string;
  onPress: () => void;
  placeholder: string;
}

interface DateDropdownGroupProps {
  day: string;
  month: string;
  year: string;
  onPressDay: () => void;
  onPressMonth: () => void;
  onPressYear: () => void;
}

const DAYS = Array.from({ length: 31 }, (_, i) =>
  (i + 1).toString().padStart(2, "0"),
);

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const DOB_YEARS = Array.from({ length: 100 }, (_, i) =>
  (currentYear - i).toString(),
);
const EXP_YEARS = Array.from({ length: 20 }, (_, i) =>
  (currentYear + i).toString(),
);

export const IdCardDetailScreen = () => {
  const router = useRouter();
  const {
    scannedId = "1103456789123",
    scannedName = "Somchai",
    scannedSurname = "Jaidee",
  } = useLocalSearchParams<{
    scannedId?: string;
    scannedName?: string;
    scannedSurname?: string;
  }>();

  const [idNumber, setIdNumber] = useState(scannedId);
  const [name, setName] = useState(scannedName);
  const [surname, setSurname] = useState(scannedSurname);

  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");

  const [expDay, setExpDay] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");

  const [isPickerVisible, setPickerVisible] = useState(false);
  const [pickerData, setPickerData] = useState<string[]>([]);
  const [onSelectCallback, setOnSelectCallback] = useState<
    ((val: string) => void) | null
  >(null);
  const [tempSelectedValue, setTempSelectedValue] = useState<string | null>(
    null,
  );

  const openPicker = (data: string[], callback: (val: string) => void) => {
    setPickerData(data);
    setOnSelectCallback(() => callback);
    setTempSelectedValue(null);
    setPickerVisible(true);
  };

  const handleNameChange = (
    text: string,
    setFunction: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const filteredText = text.replace(/[^a-zA-Z\u0E00-\u0E7F\s]/g, "");
    setFunction(filteredText);
  };

  const UnderlineDropdown = ({
    label,
    onPress,
    placeholder,
  }: UnderlineDropdownProps) => (
    <Dropdown
      label={label || placeholder}
      onPress={onPress}
      style={styles.dateDropdown}
      containerStyle={styles.underlineContainer}
      textStyle={{
        color: label ? Theme.colors.surface : "rgba(255, 255, 255, 0.5)",
        fontSize: Theme.fontSize.textL,
      }}
      iconColor={Theme.colors.g50}
    />
  );

  const DateDropdownGroup = ({
    day,
    month,
    year,
    onPressDay,
    onPressMonth,
    onPressYear,
  }: DateDropdownGroupProps) => (
    <View style={styles.dateGroupContainer}>
      <UnderlineDropdown label={day} onPress={onPressDay} placeholder="DD" />
      <UnderlineDropdown
        label={month}
        onPress={onPressMonth}
        placeholder="Month"
      />
      <UnderlineDropdown
        label={year}
        onPress={onPressYear}
        placeholder="YYYY"
      />
    </View>
  );

  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        <Header title="ID Card Information" />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <GlassCard style={styles.cardContainer}>
              {/* ID Number */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>ID Card Number</Text>
                <TextInput
                  style={styles.input}
                  value={idNumber}
                  onChangeText={setIdNumber}
                  keyboardType="numeric"
                  maxLength={13}
                  placeholder="Enter 13-digit ID"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                />
              </View>

              {/* Name */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={(text) => handleNameChange(text, setName)}
                  placeholder="Enter first name"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                />
              </View>

              {/* Surname */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={surname}
                  onChangeText={(text) => handleNameChange(text, setSurname)}
                  placeholder="Enter last name"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                />
              </View>

              {/* Date of Birth */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Date of Birth</Text>
                <DateDropdownGroup
                  day={dobDay}
                  month={dobMonth}
                  year={dobYear}
                  onPressDay={() => openPicker(DAYS, setDobDay)}
                  onPressMonth={() => openPicker(MONTHS, setDobMonth)}
                  onPressYear={() => openPicker(DOB_YEARS, setDobYear)}
                />
              </View>

              {/* Expiry Date */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Date of Expiry</Text>
                <DateDropdownGroup
                  day={expDay}
                  month={expMonth}
                  year={expYear}
                  onPressDay={() => openPicker(DAYS, setExpDay)}
                  onPressMonth={() => openPicker(MONTHS, setExpMonth)}
                  onPressYear={() => openPicker(EXP_YEARS, setExpYear)}
                />
              </View>
            </GlassCard>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Next"
              variant="solid"
              color="v300"
              onPress={() => router.push("/")}
              style={styles.submitButton}
            />
          </View>
        </KeyboardAvoidingView>

        {/* Modal Selection */}
        <Modal visible={isPickerVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setPickerVisible(false)}
            />
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setPickerVisible(false)}>
                  <Text style={styles.actionText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (onSelectCallback && tempSelectedValue)
                      onSelectCallback(tempSelectedValue);
                    setPickerVisible(false);
                  }}
                >
                  <Text style={[styles.actionText, styles.confirmText]}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={pickerData}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pickerItem}
                    onPress={() => setTempSelectedValue(item)}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        tempSelectedValue === item &&
                          styles.pickerItemSelectedText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  keyboardAvoid: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20 },
  cardContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  inputSection: { marginBottom: 28 },
  label: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.h6,
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSize.textL,
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.v300,
  },
  dateGroupContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  dateDropdown: {
    flex: 1,
  },
  underlineContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.v300,
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
  footer: { paddingHorizontal: 16 },
  submitButton: { width: "100%" },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: Theme.colors.surface,
    height: "45%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.g50,
  },
  modalTitle: {
    fontSize: Theme.fontSize.textXL,
    fontWeight: "600",
    color: Theme.colors.g300,
  },
  actionText: { fontSize: Theme.fontSize.textL, color: Theme.colors.g100 },
  confirmText: { color: Theme.colors.v300, fontWeight: "700" },
  pickerItem: { paddingVertical: 18, alignItems: "center" },
  pickerItemText: { fontSize: Theme.fontSize.textL, color: Theme.colors.g300 },
  pickerItemSelectedText: { color: Theme.colors.v300, fontWeight: "700" },
});
