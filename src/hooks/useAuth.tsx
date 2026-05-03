import { HttpHelper } from "@/lib/http";
import { AccountService } from "@/src/core/services/account.service";
import { AuthModel } from "@/src/domain/model/auth";
import { AccountRepositoryImpl } from "@/src/infrastructure/account.repository";
import { useMobileWallet } from "@wallet-ui/react-native-web3js";
import { useMemo, useState } from "react";
import { API_URL } from "../config/config";
import { useAuthStore } from "../store/auth.store";

export const useAuth = () => {
  const { account, connect, disconnect } = useMobileWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [session, setSession] = useState<AuthModel | null>(null);

  const accountService = useMemo(() => {
    const httpHelper = new HttpHelper(API_URL);
    const accountRepo = new AccountRepositoryImpl(httpHelper);
    return new AccountService(accountRepo);
  }, []);

  const { save, clear } = useAuthStore();

  const isAuthenticated = Boolean(account);

  const login = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const connectedAccount = await connect();
      const walletAddress = connectedAccount.publicKey.toBase58();
      const authSession =
        await accountService.AuthenticateWallet(walletAddress);

      save(authSession.access_token, authSession.refresh_token);
      setSession(authSession);
      return authSession;
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("Network Error") ||
          error.message.includes("Failed to fetch")
        ) {
          setErrorMessage(
            `Cannot reach API at ${API_URL}. Set EXPO_PUBLIC_API_BASE_URL for your backend host.`,
          );
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage("Login failed");
      }
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await disconnect();
      clear();
      setSession(null);
      setErrorMessage(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    isAuthenticated,
    account,
    session,
    isLoading,
    errorMessage,
    login,
    logout,
  };
};
