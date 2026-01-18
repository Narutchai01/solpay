import { IExampleRepository } from "@/core/port/http/example";
import { HttpHelper } from "@/lib/http";

export class ExampleRepository implements IExampleRepository {
  constructor(private readonly httpHelper: HttpHelper) {}
  async getExampleById(id: string) {
    return null;
  }
}
