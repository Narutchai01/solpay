import { ExampleModel } from "../../domain/example";

export interface IExampleRepository {
  getExampleById(id: string): Promise<ExampleModel | null>;
}
