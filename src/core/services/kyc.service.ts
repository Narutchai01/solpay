import { IKYCRepository } from "@/src/infrastructure/kyc.repository";
import { ConfirmKYCRequest, ConfirmKYCResponse } from "../../domain/model/kyc";

export class KYCService {
  constructor(private readonly kycRepository: IKYCRepository) {}

  async ConfirmKYC(
    data: ConfirmKYCRequest,
    token: string,
  ): Promise<ConfirmKYCResponse> {
    return await this.kycRepository.ConfirmKYC(data, token);
  }
}
