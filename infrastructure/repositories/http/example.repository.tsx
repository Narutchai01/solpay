import { HttpHelper } from "@/lib/http";
import { ExampleModel } from "@/src/core/domain/example";
import { IExampleRepository } from "@/src/core/port/http/example";

export class ExampleRepository implements IExampleRepository {
  constructor(private readonly httpHelper: HttpHelper) {}
  async getExampleById(id: string) {
    const response = await this.httpHelper.get<ExampleModel>(`/examples/${id}`);
    return response;
  }
}
