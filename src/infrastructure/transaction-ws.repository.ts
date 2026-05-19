import { API_URL } from "@/src/config/config";
import { ITransactionWebSocketPort } from "@/src/core/port/transaction-ws.repository";
import { TransactionResponse } from "@/src/domain/model/transaction";

const normalizedApiUrl = API_URL.replace(/\/+$/, "");
const defaultWsBaseUrl = normalizedApiUrl.startsWith("https://")
  ? normalizedApiUrl.replace(/^https:\/\//, "wss://")
  : normalizedApiUrl.replace(/^http:\/\//, "ws://");
const WS_BASE_URL =
  process.env.EXPO_PUBLIC_TRANSACTION_WS_URL?.trim() ||
  `${defaultWsBaseUrl}/ws/transaction`;

export class TransactionWebSocketClient implements ITransactionWebSocketPort {
  private ws: WebSocket | null = null;
  private messageCallback: ((msg: TransactionResponse) => void) | null = null;
  private errorCallback: ((error: Error) => void) | null = null;

  connect(transactionId: string) {
    if (!transactionId.trim()) {
      this.errorCallback?.(
        new Error(
          "Cannot connect transaction websocket without transactionId.",
        ),
      );
      return;
    }

    // Prevent duplicate sockets when connect is called more than once.
    this.disconnect();

    // สร้าง URL แบบ Dynamic ตาม ID
    const url = `${WS_BASE_URL}/${encodeURIComponent(transactionId)}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log(`Connected to transaction stream: ${transactionId}`);
    };

    this.ws.onmessage = (event) => {
      // สมมติว่า Backend ส่งข้อมูลมาเป็น JSON String
      try {
        const data = JSON.parse(event.data) as TransactionResponse;
        if (this.messageCallback) {
          this.messageCallback(data);
        }
      } catch (e) {
        this.errorCallback?.(new Error("Failed to parse websocket message."));
        console.warn("Failed to parse websocket message", e);
      }
    };

    this.ws.onerror = () => {
      this.errorCallback?.(
        new Error(`Transaction websocket connection failed: ${url}`),
      );
    };

    this.ws.onclose = (event) => {
      console.log(
        `Disconnected from transaction stream: ${transactionId} (code: ${event.code})`,
      );
      this.ws = null;
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  onMessage(callback: (msg: TransactionResponse) => void) {
    this.messageCallback = callback;
  }

  onError(callback: (error: Error) => void) {
    this.errorCallback = callback;
  }
}
