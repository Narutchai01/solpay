import { ExampleModel } from "../../model/example";

export interface IExampleRepository {
  getExampleById(id: string): Promise<ExampleModel | null>;
}
