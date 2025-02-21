export interface ArticleResponse {
  success: boolean;
  message: string;
  result: Article[];
}

export interface Article {
  id?: number;
  title: string;
  excerpt: string;
  content: string;
  min_to_read: number;
  feature_image: string;
  categoryId: number | null;
  category: Category | null;
  expert: Expert;
  contentTags: ContentTag[];
}

export interface Category {
  id: number;
  name: string;
  icon: string | null;
}

export interface Expert {
  id: number;
  name: string;
  about: string;
  designation: string;
  profile_picture: string;
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
