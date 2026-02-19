export interface WalletOption {
  id: string;
  name: string;
  type: "solpay" | "software";
  balance?: string;
}
