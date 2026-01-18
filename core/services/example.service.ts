import { ExampleModel } from "../domain/example";
import { IExampleRepository } from "../port/http/example";
interface ExampleService {
  getExampleById(id: string): Promise<ExampleModel | null>;
}

export class ExampleServiceImpl implements ExampleService {
  constructor(private readonly exampleRepository: IExampleRepository) {}
  getExampleById(id: string): Promise<ExampleModel | null> {
    return this.exampleRepository.getExampleById(id);
  }
}
