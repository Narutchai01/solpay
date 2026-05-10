import { ConfirmModal } from "@/src/components/modal/Confirm";
import GradientLayout from "@/src/components/shard/gradieintLayout";
import { LoadingSpinner } from "@/src/components/shard/loadingSpinner";
import { SuccessLayout } from "@/src/components/shard/successLayout";
import { Theme } from "@/src/core/theme/theme";
import { DetailConfirmationCard } from "@/src/core/type/detail-confirmation-card.type";
import { useTransaction } from "@/src/hooks/useTransaction";
import { useTransactionWs } from "@/src/hooks/useTransaction-ws";
import { VersionedTransaction } from "@solana/web3.js";
import { fromUint8Array } from "@wallet-ui/react-native-web3js";
import { Buffer } from "buffer";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FAILED_STATUSES = [
  "SOLANA_FAILED",
  "BALANCE_FAILED",
  "PAYMENT_FAILED",
  "FAILED",
];

export const SwapSuccessScreen = () => {
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

  const finalTxHash = useMemo(() => {
    const rawValue = (
      transaction?.transaction_on_chain?.signature || txHash
    )?.trim();

    if (!rawValue) return "";

    if (rawValue.length > 100) {
      try {
        const transactionBuf = Buffer.from(rawValue, "base64");
        const txObj = VersionedTransaction.deserialize(transactionBuf);
        return fromUint8Array(txObj.signatures[0]);
      } catch (e) {
        console.error("Failed to extract signature in SwapSuccess:", e);
        return rawValue;
      }
    }
    return rawValue;
  }, [transaction, txHash]);

  const formatAmount = (amount?: number, currency?: string) => {
    if (typeof amount !== "number" || Number.isNaN(amount)) {
      return `0.00 ${currency ?? ""}`.trim();
    }

    return `${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })} ${currency ?? ""}`.trim();
  };

  const formatExchangeRate = (solAmount?: number, usdtAmount?: number) => {
    if (
      typeof solAmount !== "number" ||
      typeof usdtAmount !== "number" ||
      Number.isNaN(solAmount) ||
      Number.isNaN(usdtAmount) ||
      solAmount <= 0
    ) {
      return "-";
    }

    return `1 SOL ≈ ${(usdtAmount / solAmount).toFixed(2)} USDC`;
  };

  const formatCompletionDate = (value?: Date | string) => {
    if (!value) {
      return "-";
    }

    let date: Date;
    if (typeof value === "string") {
      // Handle Go style date: "2023-10-27 10:00:00 +0000 UTC" -> "2023-10-27T10:00:00"
      const cleanValue = value.split(" +")[0].replace(" ", "T");
      date = new Date(cleanValue);
    } else {
      date = value;
    }

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

  const isFailed = useMemo(() => {
    return FAILED_STATUSES.includes(transactionByParam?.status || "");
  }, [transactionByParam?.status]);

  const swapData: DetailConfirmationCard[] = useMemo(
    () => [
      {
        label: "Transaction ID",
        value: formatTxUUID(transactionByParam?.transaction_uuid || txUUID),
      },
      {
        label: "Exchange Rate",
        value: formatExchangeRate(
          transactionByParam?.sol_amount,
          transactionByParam?.usdt_amount,
        ),
      },
      {
        label: "SOL Amount",
        value: formatAmount(transactionByParam?.sol_amount, "SOL"),
      },
      {
        label: "USDC Amount",
        value: formatAmount(transactionByParam?.usdt_amount, "USDC"),
      },
      {
        label: "Completion Date",
        value: formatCompletionDate(
          transactionByParam?.created_at ||
            (transactionByParam as any)?.createdAt,
        ),
      },
    ],
    [transactionByParam, txUUID],
  );

  const isDataLoading = !transactionByParam || !isCompleted;

  if (isDataLoading) {
    return (
      <GradientLayout>
        <SafeAreaView style={styles.loadingContainer}>
          <LoadingSpinner overlay={false} />
        </SafeAreaView>
      </GradientLayout>
    );
  }

  if (isFailed) {
    return (
      <GradientLayout>
        <ConfirmModal
          visible={true}
          title="Transaction Failed"
          description={`Reason: ${transactionByParam?.status}`}
          confirmLabel="Back to Home"
          onConfirm={() => router.replace("/(tabs)")}
          iconName="close-circle"
          iconColor={Theme.colors.errorText}
        />
      </GradientLayout>
    );
  }

  return (
    <SuccessLayout
      details={swapData}
      onButtonPress={() => router.replace("/(tabs)")}
      txHash={finalTxHash}
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
