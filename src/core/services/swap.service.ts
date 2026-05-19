import {
  SwapQuote,
  SwapQuoteRequest,
  BuildSwapTransactionRequest,
  SwapTrasnsaction,
  ExecuteSwap,
  SwapInstructionsResponse,
} from "@/src/domain/model/swap";
import { TransactionResponse } from "@/src/domain/model/transaction";
import { SwapRepository } from "../port/swap.repository";

export interface SwapService {
  GetSwapQuote(req: SwapQuoteRequest): Promise<SwapQuote | null>;
  BuildSwapTransaction(
    req: BuildSwapTransactionRequest,
    access_token: string,
  ): Promise<SwapTrasnsaction | null>;
  ExecuteSwap(
    req: ExecuteSwap,
    access_token: string,
  ): Promise<TransactionResponse | null>;
  BuildInstruction(
    req: BuildSwapTransactionRequest,
    access_token: string,
  ): Promise<SwapInstructionsResponse | null>;
  CreateUnsignedTransaction(
    instructions: any[],
    payerPublicKey: string,
    recentBlockhash: string,
  ): string;
}

export class SwapService implements SwapService {
  constructor(private readonly swapRepository: SwapRepository) {}

  async GetSwapQuote(req: SwapQuoteRequest): Promise<SwapQuote | null> {
    try {
      return await this.swapRepository.GetSwapQuote(req);
    } catch (error) {
      console.error("Failed to get swap quote:", error);
      return null;
    }
  }

  async BuildSwapTransaction(
    req: BuildSwapTransactionRequest,
    access_token: string,
  ): Promise<SwapTrasnsaction | null> {
    try {
      return await this.swapRepository.BuildSwapTransaction(req, access_token);
    } catch (error) {
      console.error("Failed to build swap transaction:", error);
      return null;
    }
  }

  async ExecuteSwap(
    req: ExecuteSwap,
    access_token: string,
  ): Promise<TransactionResponse | null> {
    try {
      // 🕵️‍♂️ เพิ่มบรรทัดนี้ เพื่อแอบดูว่าหน้าตาข้อมูลก่อนโดนส่งไป Axios เป็นยังไง
      console.log("🔍 Payload before sending:", JSON.stringify(req, null, 2));

      return await this.swapRepository.ExecuteSwap(req, access_token);
    } catch (error) {
      console.error("Failed to execute swap:", error);
      return null;
    }
  }

  async BuildInstruction(
    req: BuildSwapTransactionRequest,
    access_token: string,
  ): Promise<SwapInstructionsResponse | null> {
    try {
      return await this.swapRepository.BuildInstruction(req, access_token);
    } catch (error) {
      console.error("Failed to build instructions:", error);
      return null;
    }
  }

  CreateUnsignedTransaction(
    instructions: any[],
    payerPublicKey: string,
    recentBlockhash: string,
  ): string {
    const {
      TransactionMessage,
      VersionedTransaction,
      PublicKey,
      TransactionInstruction,
    } = require("@solana/web3.js");

    const ixList = instructions.map((ix: any) => {
      return new TransactionInstruction({
        programId: new PublicKey(ix.programId),
        keys: ix.keys.map((k: any) => ({
          pubkey: new PublicKey(k.pubkey),
          isSigner: k.isSigner,
          isWritable: k.isWritable,
        })),
        data: Buffer.from(ix.data, "base64"),
      });
    });

    const message = new TransactionMessage({
      payerKey: new PublicKey(payerPublicKey),
      recentBlockhash: recentBlockhash,
      instructions: ixList,
    }).compileToV0Message();

    const tx = new VersionedTransaction(message);
    const { fromUint8Array } = require("@wallet-ui/react-native-web3js");
    return fromUint8Array(tx.serialize());
  }
}
