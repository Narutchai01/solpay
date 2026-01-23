export interface AccountModel {
  id: number;
  public_address: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAccountRequest {
  public_address: string;
  kyc_token: string;
}
