import { HttpHelper } from "@/lib/http";
import { AccountService } from "@/src/core/services/account.service";
import { AccountRepositoryImpl } from "@/src/infrastructure/account.repository";
import { useEffect, useMemo, useState } from "react";
import { API_URL } from "../config/config";
import { AccountModel } from "../domain/model/account";
import { useAuthStore } from "../store/auth.store";

export const useAccount = () => {
  const [profile, setProfile] = useState<AccountModel | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const loadTokens = useAuthStore((state) => state.loadTokens);

  const accountService = useMemo(() => {
    const httpHelper = new HttpHelper(API_URL);
    const accountRepo = new AccountRepositoryImpl(httpHelper);
    return new AccountService(accountRepo);
  }, []);

  useEffect(() => {
    void loadTokens();
  }, [loadTokens]);

  useEffect(() => {
    const fetchAccount = async () => {
      if (accessToken) {
        try {
          const profile = await accountService.GetProfile(accessToken);
          setProfile(profile);
        } catch (error) {
          console.error("Failed to fetch account profile:", error);
        }
      } else {
        setProfile(null);
      }
    };

    fetchAccount();
  }, [accessToken, accountService]);

  return { profile };
};
