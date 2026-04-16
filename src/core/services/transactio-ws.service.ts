import { ITransactionWebSocketPort } from "@/src/core/port/transaction-ws.repository";
import { TransactionResponse } from "@/src/domain/model/transaction";

export class WSTransactionService {
  // รับ Port เข้ามาทาง Constructor (Dependency Inversion)
  constructor(private wsClient: ITransactionWebSocketPort) {}

  public monitorStatus(
    transactionId: string,
    onStatusUpdate: (status: string, isCompleted: boolean) => void,
    onError: (error: Error) => void,
  ): () => void {
    // 1. กำหนดว่าจะทำอะไรเมื่อได้รับข้อความ
    this.wsClient.onMessage((rawMsg: TransactionResponse) => {
      // --- Business Logic เกิดขึ้นที่นี่ ---
      // เช่น ตรวจสอบข้อมูล แปลง Format หรือบันทึกลง Store
      console.log("[Service] Raw message received:", rawMsg);

      const mappedStatus = (rawMsg.status || "").toUpperCase();

      if (!mappedStatus) {
        onError(
          new Error("Transaction status is missing from websocket payload."),
        );
        return;
      }

      const isCompleted = mappedStatus === "COMPLETED";

      // ส่งข้อมูลที่ผ่านการจัดการแล้วกลับไป
      onStatusUpdate(mappedStatus, isCompleted);

      // ถ้าสถานะเป็น SUCCESS อาจจะเรียก Service อื่นต่อ เช่น สั่ง fetch ยอดเงินล่าสุด
      if (mappedStatus === "SUCCESS") {
        // this.accountService.refreshBalance();
      }
    });

    this.wsClient.onError((err) => {
      console.warn("[Service] WebSocket Error:", err);
      onError(err);
    });

    // 2. สั่งเชื่อมต่อ
    this.wsClient.connect(transactionId);

    return () => {
      this.stopMonitoring();
    };
  }

  public stopMonitoring() {
    this.wsClient.disconnect();
  }
}
