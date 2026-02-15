import React, { useEffect, useRef } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Theme } from "../../core/theme/theme";

type Props = {
  visible: boolean;
  months: string[];
  years: number[];
  selectedMonth: string;
  selectedYear: number;
  onSelectMonth: (month: string) => void;
  onSelectYear: (year: number) => void;
  onClose: () => void;
  onConfirm?: () => void;
};

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

export const MonthYearPickerModal = ({
  visible,
  months,
  years,
  selectedMonth,
  selectedYear,
  onSelectMonth,
  onSelectYear,
  onClose,
  onConfirm,
}: Props) => {
  const monthRef = useRef<FlatList>(null);
  const yearRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!visible) return;

    const monthIndex = months.indexOf(selectedMonth);
    const yearIndex = years.indexOf(selectedYear);

    requestAnimationFrame(() => {
      if (monthIndex >= 0) {
        monthRef.current?.scrollToIndex({
          index: monthIndex,
          animated: false,
        });
      }

      if (yearIndex >= 0) {
        yearRef.current?.scrollToIndex({
          index: yearIndex,
          animated: false,
        });
      }
    });
  }, [visible, selectedMonth, selectedYear, months, years]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.actionText}>Cancel</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Select</Text>

            <TouchableOpacity
              onPress={() => {
                onConfirm?.();
                onClose();
              }}
            >
              <Text style={[styles.actionText, styles.confirm]}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Picker Container */}
          <View style={styles.pickerContainer}>
            <View pointerEvents="none" style={styles.centerHighlight} />

            {/* Month */}
            <FlatList
              ref={monthRef}
              data={months}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              style={styles.list}
              contentContainerStyle={styles.listContent}
              getItemLayout={(_, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.y / ITEM_HEIGHT,
                );
                if (months[index]) onSelectMonth(months[index]);
              }}
              renderItem={({ item }) => {
                const isSelected = item === selectedMonth;
                return (
                  <View style={styles.item}>
                    <Text
                      style={[styles.text, isSelected && styles.selectedText]}
                    >
                      {item}
                    </Text>
                  </View>
                );
              }}
            />

            {/* Year*/}
            <FlatList
              ref={yearRef}
              data={years}
              keyExtractor={(item) => item.toString()}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              style={styles.list}
              contentContainerStyle={styles.listContent}
              getItemLayout={(_, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.y / ITEM_HEIGHT,
                );
                if (years[index]) onSelectYear(years[index]);
              }}
              renderItem={({ item }) => {
                const isSelected = item === selectedYear;
                return (
                  <View style={styles.item}>
                    <Text
                      style={[styles.text, isSelected && styles.selectedText]}
                    >
                      {item}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: Theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    color: Theme.colors.onSurface,
    fontSize: Theme.fontSize.h5,
    fontWeight: "600",
  },
  actionText: {
    fontSize: Theme.fontSize.textXL,
    color: Theme.colors.g300,
  },
  confirm: {
    color: Theme.colors.v300,
    fontSize: Theme.fontSize.textXL,
    fontWeight: "600",
  },
  pickerContainer: {
    flexDirection: "row",
    height: PICKER_HEIGHT,
    position: "relative",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: ITEM_HEIGHT * 2,
  },
  centerHighlight: {
    position: "absolute",
    top: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
    left: 16,
    right: 16,
    height: ITEM_HEIGHT,
    borderRadius: 12,
    backgroundColor: Theme.colors.g50,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: Theme.fontSize.textM,
    color: Theme.colors.g75,
  },
  selectedText: {
    fontSize: Theme.fontSize.textXL,
    fontWeight: "700",
    color: Theme.colors.onSurface,
  },
});
