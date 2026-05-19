import { Button } from "@/src/components/button/button";
import { Dropdown } from "@/src/components/button/dropdown";
import { GlassCard } from "@/src/components/card/glass";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Header } from "@/src/components/shard/header";
import { useKYC } from "@/src/hooks/useKYC";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
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
  const { loading } = useKYC();

  const { frontImageUri, backImageUri } = useLocalSearchParams<{
    frontImageUri: string;
    backImageUri: string;
  }>();

  const [formData, setFormData] = useState({
    idNumber: "",
    name: "",
    surname: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    expDay: "",
    expMonth: "",
    expYear: "",
  });

  const [pickerConfig, setPickerConfig] = useState<{
    isVisible: boolean;
    data: string[];
    tempValue: string | null;
    targetField: keyof typeof formData | null;
  }>({
    isVisible: false,
    data: [],
    tempValue: null,
    targetField: null,
  });

  const isFormValid = useMemo(() => {
    return (
      formData.idNumber.length === 13 &&
      formData.name.trim().length > 0 &&
      formData.surname.trim().length > 0 &&
      formData.dobDay !== "" &&
      formData.dobMonth !== "" &&
      formData.dobYear !== "" &&
      formData.expDay !== "" &&
      formData.expMonth !== "" &&
      formData.expYear !== ""
    );
  }, [formData]);

  const updateForm = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const openPicker = (data: string[], field: keyof typeof formData) => {
    setPickerConfig({
      isVisible: true,
      data: data,
      tempValue: formData[field] || null,
      targetField: field,
    });
  };

  const handleNameChange = (field: "name" | "surname", text: string) => {
    const filteredText = text.replace(/[^a-zA-Z\u0E00-\u0E7F\s]/g, "");
    updateForm(field, filteredText);
  };

  const handleNext = async () => {
    const formatDate = (y: string, m: string, d: string) => {
      const monthIdx = MONTHS.indexOf(m) + 1;
      const monthStr = monthIdx.toString().padStart(2, "0");
      const dayStr = d.padStart(2, "0");
      return `${y}-${monthStr}-${dayStr} 00:00:00.000000+00`;
    };

    router.push({
      pathname: "/faceScan",
      params: {
        idCard: formData.idNumber,
        firstName: formData.name,
        lastName: formData.surname,
        birthDate: formatDate(
          formData.dobYear,
          formData.dobMonth,
          formData.dobDay,
        ),
        expireDate: formatDate(
          formData.expYear,
          formData.expMonth,
          formData.expDay,
        ),
        frontImageUri,
        backImageUri,
      },
    });
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
        color: label ? Theme.colors.surface : "rgba(255, 255, 255, 0.4)",
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
              {/* ID Number Input */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>ID Card Number</Text>
                <TextInput
                  style={styles.input}
                  value={formData.idNumber}
                  onChangeText={(text) =>
                    updateForm("idNumber", text.replace(/[^0-9]/g, ""))
                  }
                  keyboardType="number-pad"
                  maxLength={13}
                  placeholder="13-digit number"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                />
              </View>

              {/* First Name Input */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => handleNameChange("name", text)}
                  placeholder="Enter first name"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                />
              </View>

              {/* Last Name Input */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.surname}
                  onChangeText={(text) => handleNameChange("surname", text)}
                  placeholder="Enter last name"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                />
              </View>

              {/* Date of Birth Selection */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Date of Birth</Text>
                <DateDropdownGroup
                  day={formData.dobDay}
                  month={formData.dobMonth}
                  year={formData.dobYear}
                  onPressDay={() => openPicker(DAYS, "dobDay")}
                  onPressMonth={() => openPicker(MONTHS, "dobMonth")}
                  onPressYear={() => openPicker(DOB_YEARS, "dobYear")}
                />
              </View>

              {/* Expiry Date Selection */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Date of Expiry</Text>
                <DateDropdownGroup
                  day={formData.expDay}
                  month={formData.expMonth}
                  year={formData.expYear}
                  onPressDay={() => openPicker(DAYS, "expDay")}
                  onPressMonth={() => openPicker(MONTHS, "expMonth")}
                  onPressYear={() => openPicker(EXP_YEARS, "expYear")}
                />
              </View>
            </GlassCard>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <Button
            title={loading ? "Submitting..." : "Next"}
            onPress={handleNext}
            disabled={loading || !isFormValid}
            variant="solid"
            color="v300"
            style={styles.submitButton}
          />
        </View>

        {/* Custom Picker Modal */}
        <Modal
          visible={pickerConfig.isVisible}
          transparent
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() =>
                setPickerConfig((p) => ({ ...p, isVisible: false }))
              }
            />
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() =>
                    setPickerConfig((p) => ({ ...p, isVisible: false }))
                  }
                >
                  <Text style={styles.actionText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (pickerConfig.targetField && pickerConfig.tempValue) {
                      updateForm(
                        pickerConfig.targetField,
                        pickerConfig.tempValue,
                      );
                    }
                    setPickerConfig((p) => ({ ...p, isVisible: false }));
                  }}
                >
                  <Text style={[styles.actionText, styles.confirmText]}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={pickerConfig.data}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pickerItem}
                    onPress={() =>
                      setPickerConfig((p) => ({ ...p, tempValue: item }))
                    }
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        pickerConfig.tempValue === item &&
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
  cardContainer: { marginTop: 12, paddingHorizontal: 16, paddingTop: 18 },
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
    marginTop: 8,
  },
  dateDropdown: { flex: 1 },
  underlineContainer: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderBottomColor: Theme.colors.v300,
    paddingVertical: 10,
  },
  footer: { paddingHorizontal: 16 },
  submitButton: { width: "100%", paddingVertical: 10 },
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
