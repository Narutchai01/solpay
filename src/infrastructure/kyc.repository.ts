import { HttpHelper } from "@/lib/http";
import { ConfirmKYCRequest, ConfirmKYCResponse } from "../domain/model/kyc";

export interface IKYCRepository {
  ConfirmKYC(
    data: ConfirmKYCRequest,
    token: string,
  ): Promise<ConfirmKYCResponse>;
}

export class KYCRepositoryImpl implements IKYCRepository {
  constructor(private readonly httpHelper: HttpHelper) {}

  async ConfirmKYC(
    data: ConfirmKYCRequest,
    token: string,
  ): Promise<ConfirmKYCResponse> {
    const formData = new FormData();

    formData.append("id_card", data.id_card);
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("birth_date", data.birth_date);
    formData.append("expire_date", data.expire_date);

    if (data.front_card_image?.uri) {
      const frontFile = {
        uri: data.front_card_image.uri,
        name: data.front_card_image.name,
        type: data.front_card_image.type,
      } as unknown as Blob;

      formData.append("front_card_image", frontFile);
    }

    if (data.back_card_image?.uri) {
      const backFile = {
        uri: data.back_card_image.uri,
        name: data.back_card_image.name,
        type: data.back_card_image.type,
      } as unknown as Blob;

      formData.append("back_card_image", backFile);
    }

    if (data.face_image?.uri) {
      const faceFile = {
        uri: data.face_image.uri,
        name: data.face_image.name,
        type: data.face_image.type,
      } as unknown as Blob;

      formData.append("face_image", faceFile);
    }

    return await this.httpHelper.post<ConfirmKYCResponse>(
      "/api/v1/users",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
}
