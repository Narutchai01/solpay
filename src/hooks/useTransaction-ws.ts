import { useCallback, useMemo, useState } from "react";
import { WSTransactionService } from "../core/services/transactio-ws.service";
import { TransactionWebSocketClient } from "../infrastructure/transaction-ws.repository";

export const useTransactionWs = () => {
  const [isCompleted, setIsCompleted] = useState(false);

  const wsTransactionService = useMemo(() => {
    const wsClient = new TransactionWebSocketClient();
    return new WSTransactionService(wsClient);
  }, []);

  const GetWsTransaction = useCallback(
    (txUUID: string) => {
      const normalizedTxUUID = txUUID.trim();
      setIsCompleted(false);

      if (!normalizedTxUUID) {
        console.warn("[TransactionWS] txUUID is empty, skip monitoring.");
        return () => {
          // no-op cleanup when no websocket connection is created
        };
      }

      return wsTransactionService.monitorStatus(
        normalizedTxUUID,
        (status, completed) => {
          console.log("Transaction Status Updated:", status);
          if (completed) {
            setIsCompleted(true);
          }
          // อาจจะอัพเดต State หรือเรียก Service อื่นๆ ที่นี่
        },
        (error) => {
          console.warn("[TransactionWS] WebSocket Error:", error);
          // อาจจะแสดงข้อความแจ้งเตือนผู้ใช้ หรือทำการ Retry
        },
      );
    },
    [wsTransactionService],
  );

  const StopWsTransaction = useCallback(() => {
    wsTransactionService.stopMonitoring();
  }, [wsTransactionService]);

  return {
    GetWsTransaction,
    StopWsTransaction,
    isCompleted,
  };
};
