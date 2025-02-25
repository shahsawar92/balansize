export interface Translation {
  id?: number;
  language: string;
  name: string;
}

export interface Category {
  id?: number;
  name: string;
  icon: string;
  translations: Translation[];
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  result: Category[];
}

export interface SingleCategoryResponse {
  success: boolean;
  message: string;
  result: Category;
}

export interface CategoryRequest {
  name: string;
  icon: File | null;
  translations: Translation[];
}
