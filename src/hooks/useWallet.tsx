import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  transact,
  Web3MobileWallet,
} from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useMemo, useState } from "react";

// Constants
const AUTH_TOKEN_KEY = "mwa_auth_token";
const USER_ACCOUNT_KEY = "mwa_user_account";

const APP_IDENTITY = {
  name: "SolPay",
  uri: "https://solpay.app",
  icon: "favicon.ico",
} as const;

// Types
interface WalletState {
  authToken: string | null;
  publicKey: PublicKey | null;
  isConnecting: boolean;
  error: Error | null;
}

interface UseWalletReturn {
  connect: () => Promise<PublicKey | null>;
  disconnect: () => Promise<void>;
  publicKey: PublicKey | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  clearError: () => void;
}

export function useWallet(): UseWalletReturn {
  const [state, setState] = useState<WalletState>({
    authToken: null,
    publicKey: null,
    isConnecting: false,
    error: null,
  });

  // Load persisted session on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const [token, account] = await Promise.all([
          AsyncStorage.getItem(AUTH_TOKEN_KEY),
          AsyncStorage.getItem(USER_ACCOUNT_KEY),
        ]);

        if (token && account) {
          setState((prev) => ({
            ...prev,
            authToken: token,
            publicKey: new PublicKey(account),
          }));
        }
      } catch (error) {
        console.warn("Failed to load wallet session:", error);
      }
    };

    loadSession();
  }, []);

  // Persist session
  const persistSession = useCallback(
    async (token: string | null, pubKey: PublicKey | null) => {
      try {
        if (token && pubKey) {
          await Promise.all([
            AsyncStorage.setItem(AUTH_TOKEN_KEY, token),
            AsyncStorage.setItem(USER_ACCOUNT_KEY, pubKey.toBase58()),
          ]);
        } else {
          await Promise.all([
            AsyncStorage.removeItem(AUTH_TOKEN_KEY),
            AsyncStorage.removeItem(USER_ACCOUNT_KEY),
          ]);
        }
      } catch (error) {
        console.warn("Failed to persist wallet session:", error);
      }
    },
    [],
  );

  const connect = useCallback(async (): Promise<PublicKey | null> => {
    if (state.isConnecting) return null;

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const result = await transact(async (wallet: Web3MobileWallet) => {
        if (state.authToken) {
          try {
            return await wallet.reauthorize({
              auth_token: state.authToken,
              identity: APP_IDENTITY,
            });
          } catch {}
        }

        return await wallet.authorize({
          chain: "solana:devnet",
          identity: APP_IDENTITY,
        });
      });

      const pubKey = new PublicKey(result.accounts[0].address);
      const token = result.auth_token;

      setState((prev) => ({
        ...prev,
        authToken: token,
        publicKey: pubKey,
        isConnecting: false,
      }));

      await persistSession(token, pubKey);
      return pubKey;
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Connection failed");
      setState((prev) => ({ ...prev, error: err, isConnecting: false }));
      console.error("Wallet connection error:", error);
      return null;
    }
  }, [state.authToken, state.isConnecting, persistSession]);

  const disconnect = useCallback(async (): Promise<void> => {
    if (!state.authToken) return;

    try {
      await transact(async (wallet: Web3MobileWallet) => {
        await wallet.deauthorize({ auth_token: state.authToken! });
      });
    } catch (error) {
      console.warn("Deauthorize error:", error);
    }

    setState({
      authToken: null,
      publicKey: null,
      isConnecting: false,
      error: null,
    });

    await persistSession(null, null);
  }, [state.authToken, persistSession]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return useMemo(
    () => ({
      connect,
      disconnect,
      publicKey: state.publicKey,
      isConnected: !!state.publicKey,
      isConnecting: state.isConnecting,
      error: state.error,
      clearError,
    }),
    [
      connect,
      disconnect,
      state.publicKey,
      state.isConnecting,
      state.error,
      clearError,
    ],
  );
}
