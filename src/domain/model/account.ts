export interface AccountModel {
  id: number;
  public_address: string;
  is_kyc_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAccountRequest {
  public_address: string;
}
