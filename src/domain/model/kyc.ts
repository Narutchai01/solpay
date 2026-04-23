export interface ConfirmKYCRequest {
  id_card: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  expire_date: string;
  front_card_image: {
    uri: string;
    name: string;
    type: string;
  };
  back_card_image: {
    uri: string;
    name: string;
    type: string;
  };
  face_image: {
    uri: string;
    name: string;
    type: string;
  };
}

export interface ConfirmKYCResponse {
  id: number;
  id_card: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  expire_date: string;
  front_card_url: string;
  back_card_url: string;
  face_image: string;
}
