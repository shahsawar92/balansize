import { Category } from "./categories-types";

export interface ArticleResponse {
  success: boolean;
  message: string;
  data: Article[];
}

export interface singleArticleResponse {
  success: boolean;
  message: string;
  data: Article;
}

export interface Article {
  article_id?: number;
  title: string;
  excerpt: string;
  content: string;
  type: string;
  min_to_read: number;
  tags?: Tags[];
  feature_image: string | null;
  categoryId: number | null;
  category: Category;
  expert: Expert;
}

export interface Tags {
  id: number;
  name: string;
}

export interface Expert {
  id: number;
  name: string;
  about: string;
  designation: string;
  profile_picture: string | File;
  categoryId?: number;
  tags?: string[];
}
export interface ContentTag {
  id: number;
  content_id: number;
  content_type: string;
  categoryId: number;
  tagId: number;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}
