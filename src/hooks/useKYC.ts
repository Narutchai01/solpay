import { HttpHelper } from "@/lib/http";
import { useMemo, useState } from "react";
import { API_URL } from "../config/config";
import { KYCService } from "../core/services/kyc.service";
import { ConfirmKYCRequest } from "../domain/model/kyc";
import { KYCRepositoryImpl } from "../infrastructure/kyc.repository";
import { useAuthStore } from "../store/auth.store";

export const useKYC = () => {
  const [loading, setLoading] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  const kycService = useMemo(() => {
    const httpHelper = new HttpHelper(API_URL);
    const repo = new KYCRepositoryImpl(httpHelper);
    return new KYCService(repo);
  }, []);

  const confirmKYC = async (data: ConfirmKYCRequest) => {
    if (!accessToken) throw new Error("No access token found");
    setLoading(true);
    try {
      const response = await kycService.ConfirmKYC(data, accessToken);
      return response;
    } finally {
      setLoading(false);
    }
  };

  return { confirmKYC, loading };
};
