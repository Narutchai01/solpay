import GradientLayout from "@/src/components/shard/gradieintLayout";
import { LoadingSpinner } from "@/src/components/shard/loadingSpinner";
import { SuccessLayout } from "@/src/components/shard/successLayout";
import { DetailConfirmationCard } from "@/src/core/type/detail-confirmation-card.type";
import { useTransaction } from "@/src/hooks/useTransaction";
import { useTransactionWs } from "@/src/hooks/useTransaction-ws";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const TopupSuccessScreen = () => {
  const params = useLocalSearchParams<{
    txUUID?: string | string[];
    txHash?: string | string[];
  }>();
  const txUUID = useMemo(() => {
    const rawTxUUID = params.txUUID;
    if (Array.isArray(rawTxUUID)) {
      return rawTxUUID[0]?.trim() ?? "";
    }
    return rawTxUUID?.trim() ?? "";
  }, [params.txUUID]);

  const txHash = useMemo(() => {
    const rawTxHash = params.txHash;
    if (Array.isArray(rawTxHash)) {
      return rawTxHash[0]?.trim() ?? "";
    }
    return rawTxHash?.trim() ?? "";
  }, [params.txHash]);

  const { GetWsTransaction, isCompleted } = useTransactionWs();
  const { GetTransactionByID, transaction } = useTransaction();

  useEffect(() => {
    const stopMonitoring = GetWsTransaction(txUUID);

    return () => {
      stopMonitoring();
    };
  }, [GetWsTransaction, txUUID]);

  useEffect(() => {
    if (!isCompleted || !txUUID) {
      return;
    }

    void GetTransactionByID(txUUID);
  }, [GetTransactionByID, isCompleted, txUUID]);

  const formatAmount = (amount?: number, currency?: string) => {
    if (typeof amount !== "number" || Number.isNaN(amount)) {
      return `0.00 ${currency ?? ""}`.trim();
    }

    return `${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${currency ?? ""}`.trim();
  };

  const formatExchangeRate = (thbAmount?: number, usdtAmount?: number) => {
    if (
      typeof thbAmount !== "number" ||
      typeof usdtAmount !== "number" ||
      Number.isNaN(thbAmount) ||
      Number.isNaN(usdtAmount) ||
      usdtAmount <= 0
    ) {
      return "-";
    }

    return `1 USDT = ${(thbAmount / usdtAmount).toFixed(2)} THB`;
  };

  const formatCompletionDate = (value?: Date | string) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    const formatted = date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return formatted.replace(",", " -");
  };

  const formatTxUUID = (value?: string) => {
    if (!value) {
      return "N/A";
    }

    if (value.length <= 8) {
      return value;
    }

    return `${value.slice(0, 4)}....${value.slice(-4)}`;
  };

  const transactionByParam =
    transaction?.transaction_uuid === txUUID ? transaction : null;

  const swapData: DetailConfirmationCard[] = useMemo(
    () => [
      {
        label: "Transaction ID",
        value: formatTxUUID(transactionByParam?.transaction_uuid || txUUID),
      },
      {
        label: "Exchange Rate",
        value: formatExchangeRate(
          transactionByParam?.thb_amount,
          transactionByParam?.usdt_amount,
        ),
      },
      {
        label: "Fee",
        value: formatAmount(transactionByParam?.fee, "USDT"),
      },
      {
        label: "THB Amount",
        value: formatAmount(transactionByParam?.thb_amount, "THB"),
      },
      {
        label: "USDT Amount",
        value: formatAmount(transactionByParam?.usdt_amount, "USDT"),
      },
      {
        label: "Completion Date",
        value: formatCompletionDate(transactionByParam?.created_at),
      },
    ],
    [transactionByParam, txUUID],
  );

  if (!txUUID || !isCompleted || !transactionByParam) {
    return (
      <GradientLayout>
        <SafeAreaView style={styles.loadingContainer}>
          <LoadingSpinner overlay={false} />
        </SafeAreaView>
      </GradientLayout>
    );
  }

  return (
    <SuccessLayout
      details={swapData}
      onButtonPress={() => router.replace("/(tabs)")}
      txHash={txHash}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
