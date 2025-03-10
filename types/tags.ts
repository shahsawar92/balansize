// tags.ts - Type definitions for Tags API

export interface TagTranslation {
  id: number;
  language: string;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
  translations: TagTranslation[];
  question_option_tags: any[]; // Adjust type if needed
}

export interface TagResponse {
  success: boolean;
  message: string;
  result: Tag[];
}

export interface StringTagsResponse {
  success: boolean;
  message: string;
  result: string[];
}

export interface SingleTagResponse {
  success: boolean;
  message: string;
  result: Tag;
}
