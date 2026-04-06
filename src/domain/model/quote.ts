export interface CreateQuoteRequest {
  thb_amount: number;
  action_type: "ONCHAIN" | "TOPUP" | "OFFCHAIN";
  promptpay_id?: string;
}

export interface Quote {
  quote_id: string;
  thb_amount: number;
  usdt_amount: number;
  exchange_rate: number;
  promptpay_id?: string;
  fee: number;
  expires_in_seconds: number;
}

export interface ConFirmQuoteResponse {
  tx_hash: string;
}
