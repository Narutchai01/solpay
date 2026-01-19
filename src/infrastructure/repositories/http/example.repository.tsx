import { HttpHelper } from "@/lib/http";
import { ExampleModel } from "@/src/core/domain/example";
import { IExampleRepository } from "@/src/core/port/http/example";
import { BackendErrorResponse } from "@/src/type/api-error.type";
import { isAxiosError } from "axios";

export class ExampleRepository implements IExampleRepository {
  constructor(private readonly httpHelper: HttpHelper) {}
  async getExampleById(id: string) {
    try {
      const response = await this.httpHelper.get<ExampleModel>(
        `/examples/${id}`,
      );
      return response;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const resp = error.response.data as BackendErrorResponse;
        switch (status) {
          case 404:
            return null;
          case 500:
            throw new Error(resp.message || "Internal Server Error");
        }
      }
      throw error;
    }
  }
}
