export interface CategoryModel {
  id: number;
  name: string;
}

export interface CategoryResponse {
  code: number;
  message: string;
  data: CategoryModel[];
}
