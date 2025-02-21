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

export interface CategoryRequest {
  key: string;
  value: string | File | string[];
  type: "text" | "file";
}
