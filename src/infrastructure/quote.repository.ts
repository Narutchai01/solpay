import { BackendErrorResponse } from "@/src/core/type/api-error.type";
import { isAxiosError } from "axios";
import { HttpHelper } from "../../lib/http";
import { IQuoteRepository } from "../core/port/quote.repository";
import { BaseModel } from "../domain/model";
import {
  ConFirmQuoteResponse,
  CreateQuoteRequest,
  Quote,
} from "../domain/model/quote";

export class QuoteRepositoryImpl implements IQuoteRepository {
  constructor(private readonly httpHelper: HttpHelper) {}

  async CreateQuote(
    quote: CreateQuoteRequest,
    access_token: string,
  ): Promise<Quote> {
    try {
      const resp = await this.httpHelper.post<BaseModel<Quote>>(
        "/api/v1/quotes",
        quote,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      return resp.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const resp = error.response.data as BackendErrorResponse;
        switch (status) {
          case 404:
            throw new Error("Quote not found");
          case 500:
            throw new Error(resp.message || "Internal Server Error");
        }
      }
      throw error;
    }
  }

  async GetQuoteByID(id: string, access_token: string): Promise<Quote> {
    try {
      const resp = await this.httpHelper.get<BaseModel<Quote>>(
        `/api/v1/quotes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      return resp.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const resp = error.response.data as BackendErrorResponse;
        switch (status) {
          case 404:
            throw new Error("Quote not found");
          case 500:
            throw new Error(resp.message || "Internal Server Error");
        }
      }
      throw error;
    }
  }

  async ConfirmQuote(
    id: string,
    access_token: string,
  ): Promise<ConFirmQuoteResponse> {
    try {
      const resp = await this.httpHelper.patch<BaseModel<ConFirmQuoteResponse>>(
        `/api/v1/quotes/${id}/confirm`,
        {},
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );
      return resp.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const resp = error.response.data as BackendErrorResponse;
        switch (status) {
          case 404:
            throw new Error("Quote not found");
          case 500:
            throw new Error(resp.message || "Internal Server Error");
        }
      }
      throw error;
    } finally {
      this.httpHelper.clearAuthorization();
    }
  }
}
