import { HttpHelper } from "@/lib/http";
import { CategoryResponse } from "../domain/model/category";

export interface CategoryRepository {
  GetCategories(): Promise<CategoryResponse>;
}

export class CategoryRepositoryImpl implements CategoryRepository {
  constructor(private httpHelper: HttpHelper) {}

  async GetCategories(): Promise<CategoryResponse> {
    return await this.httpHelper.get<CategoryResponse>("/api/v1/categories");
  }
}
