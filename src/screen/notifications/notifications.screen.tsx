import GradientLayout from "@/src/components/shard/gradieintLayout";
import { Header } from "@/src/components/shard/header";
import React from "react";
import {
  ScrollView,
  StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NotificationCard } from "./notificationCard.component";

const NotificationScreen = () => {
  return (
    <GradientLayout>
      <SafeAreaView style={styles.container}>
        <Header title="Notification" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <NotificationCard
            title="Please verify your identity (KYC)"
            description="You will not be able to use the app's features if your identity is not verified."
            date="28 Nov 2025, 12:24 AM"
            iconName="person-circle-outline"
          />
        </ScrollView>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
});

export default NotificationScreen;
