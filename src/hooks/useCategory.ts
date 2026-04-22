import { HttpHelper } from "@/lib/http";
import { useCallback, useMemo, useState } from "react";
import { API_URL } from "../config/config";
import { CategoryServiceImpl } from "../core/services/category.service";
import { CategoryModel } from "../domain/model/category";
import { CategoryRepositoryImpl } from "../infrastructure/category.repository";

export const useCategory = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const categoryService = useMemo(() => {
    const httpHelper = new HttpHelper(API_URL);
    const categoryRepo = new CategoryRepositoryImpl(httpHelper);
    return new CategoryServiceImpl(categoryRepo);
  }, []);

  const GetCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await categoryService.GetCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }, [categoryService]);

  return { categories, GetCategories, loading };
};
