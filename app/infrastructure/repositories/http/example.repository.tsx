import { IExampleRepository } from "@/app/core/port/http/example";
import { HttpHelper } from "@/app/utils/http";

export class ExampleRepository implements IExampleRepository {
  constructor(private readonly httpHelper: HttpHelper) {}
  async getExampleById(id: string) {
    return null;
  }
}
