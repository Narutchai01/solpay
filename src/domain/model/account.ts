export interface User {
  id: number;
  id_card: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  status: string;
  expire_date: string;
  face_url: string;
  front_card_url: string;
  back_card_url: string;
}

export interface AccountModel {
  id: number;
  public_address: string;
  is_kyc_verified: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface CreateAccountRequest {
  public_address: string;
}
