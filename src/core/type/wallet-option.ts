export interface WalletOption {
  id: string;
  name: string;
  type: "OFFCHAIN" | "ONCHAIN";
  balance?: string;
}
