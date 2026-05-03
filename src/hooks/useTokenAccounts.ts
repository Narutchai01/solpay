import { AssetData } from "@/src/screen/home/assets.component";
import { useMobileWallet } from "@wallet-ui/react-native-web3js";
import { Ionicons } from "@expo/vector-icons";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
);

const METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
);

type IoniconName = keyof typeof Ionicons.glyphMap;

interface KnownToken {
  name: string;
  symbol: string;
  icon: IoniconName;
}

const KNOWN_TOKENS: Record<string, KnownToken> = {
  // Mainnet USDT
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: {
    name: "Tether USD",
    symbol: "USDT",
    icon: "logo-usd",
  },
  // Mainnet USDC
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
    name: "USD Coin",
    symbol: "USDC",
    icon: "cash-outline",
  },
  // Devnet USDC
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU": {
    name: "USD Coin",
    symbol: "USDC",
    icon: "cash-outline",
  },
  // Devnet USDT
  BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k: {
    name: "Tether USD",
    symbol: "USDT",
    icon: "logo-usd",
  },
};

/**
 * Decode the URI field from a Metaplex Token Metadata v2/v3 account.
 *
 * Fixed binary layout (Borsh with puffed/padded strings):
 *   offset  0 :  1 byte  – key
 *   offset  1 : 32 bytes – update_authority
 *   offset 33 : 32 bytes – mint
 *   offset 65 :  4 bytes – name length (u32 LE) + 32 bytes name data (padded)
 *   offset101 :  4 bytes – symbol length (u32 LE) + 10 bytes symbol data (padded)
 *   offset115 :  4 bytes – uri length (u32 LE) + up to 200 bytes uri data (padded)
 */
const decodeMetadataUri = (data: Buffer): string | null => {
  try {
    let offset = 1 + 32 + 32; // 65  – past key + update_authority + mint
    offset += 4 + 32; // 101 – past name length + padded name
    offset += 4 + 10; // 115 – past symbol length + padded symbol

    const uriLen = data.readUInt32LE(offset);
    offset += 4; // 119 – now pointing at URI bytes

    if (uriLen === 0 || uriLen > 200) return null;

    const uri = data
      .slice(offset, offset + uriLen)
      .toString("utf8")
      .replace(/\0/g, "")
      .trim();

    return uri || null;
  } catch {
    return null;
  }
};

/**
 * Try to resolve an on-chain image URI for a given SPL token mint:
 *  1. Derive the Metaplex metadata PDA.
 *  2. Fetch and decode the account to extract the off-chain metadata URI.
 *  3. Fetch the JSON at that URI and return the `image` field.
 * Returns null at any failure so callers can fall back to an icon.
 */
const fetchTokenImageUri = async (
  connection: Connection,
  mint: PublicKey,
): Promise<string | null> => {
  try {
    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      METADATA_PROGRAM_ID,
    );

    const accountInfo = await connection.getAccountInfo(metadataPDA);
    if (!accountInfo) return null;

    const uri = decodeMetadataUri(Buffer.from(accountInfo.data));
    if (!uri) return null;

    const response = await fetch(uri);
    if (!response.ok) return null;

    const json = (await response.json()) as { image?: string };
    return json.image ?? null;
  } catch {
    return null;
  }
};

export const useTokenAccounts = () => {
  const { account, connection } = useMobileWallet();
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAssets = useCallback(async () => {
    if (!account) return;

    setLoading(true);
    try {
      const publicKey = account.publicKey;

      // ── Native SOL balance ──────────────────────────────────────────────
      const lamports = await connection.getBalance(publicKey);
      const solBalance = lamports / LAMPORTS_PER_SOL;

      const solAsset: AssetData = {
        id: "native-sol",
        name: "Solana",
        sub: `${solBalance} SOL`,
        val: solBalance.toString(),
        icon: "logo-bitcoin",
        currency: "SOL",
        // No Metaplex metadata for native SOL – icon is used as fallback
      };

      // ── SPL token accounts ──────────────────────────────────────────────
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID },
      );

      const nonZero = tokenAccounts.value.filter(({ account: ta }) => {
        const uiAmount: number | null =
          ta.data.parsed.info.tokenAmount.uiAmount;
        return uiAmount !== null && uiAmount > 0;
      });

      // Try to fetch on-chain image URIs in parallel; failures are fine
      const imageResults = await Promise.allSettled(
        nonZero.map(({ account: ta }) =>
          fetchTokenImageUri(
            connection,
            new PublicKey(ta.data.parsed.info.mint as string),
          ),
        ),
      );

      const tokenAssets: AssetData[] = nonZero.map(({ account: ta }, idx) => {
        const info = ta.data.parsed.info;
        const mint: string = info.mint;
        const uiAmount: number = info.tokenAmount.uiAmount ?? 0;
        const uiAmountString: string = info.tokenAmount.uiAmountString ?? "0";

        const known = KNOWN_TOKENS[mint];
        const symbol = known?.symbol ?? mint.slice(0, 4).toUpperCase();
        const name = known?.name ?? `Token (${mint.slice(0, 6)}…)`;
        const icon: IoniconName = known?.icon ?? "wallet-outline";

        const imageResult = imageResults[idx];
        const imageUri =
          imageResult.status === "fulfilled" && imageResult.value
            ? imageResult.value
            : undefined;

        return {
          id: mint,
          name,
          sub: `${uiAmountString} ${symbol}`,
          val: uiAmountString,
          icon,
          currency: symbol,
          imageUri,
        };
      });

      setAssets([solAsset, ...tokenAssets]);
    } catch (error) {
      console.error("Failed to fetch on-chain assets:", error);
    } finally {
      setLoading(false);
    }
  }, [account, connection]);

  useEffect(() => {
    void fetchAssets();
  }, [fetchAssets]);

  return { assets, loading, fetchAssets };
};
