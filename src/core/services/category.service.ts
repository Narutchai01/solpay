import { CategoryResponse } from "../../domain/model/category";
import { CategoryRepository } from "../../infrastructure/category.repository";

export interface CategoryService {
  GetCategories(): Promise<CategoryResponse>;
}

export class CategoryServiceImpl implements CategoryService {
  constructor(private categoryRepo: CategoryRepository) {}

  async GetCategories(): Promise<CategoryResponse> {
    return await this.categoryRepo.GetCategories();
  }
}
