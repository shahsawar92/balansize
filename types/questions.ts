export interface Tag {
  id: number;
  tags?: string[]; // Optional because not all options have tags
}

export interface Option {
  id: number;
  option_text: string;
  tags?: string[]; // Some options may not have tags
}

export interface QuestionText {
  id: number;
  language: string;
  question_text?: string;
  options: Option[];
}

export interface Question {
  id: number | null;
  is_questioner: boolean;
  is_for_expert: boolean;
  is_multiple: boolean;
  category_id: number;
  question_texts: QuestionText[];
}

export interface QuestionResponse {
  success: boolean;
  message: string;
  result: Question[];
}

export type TranslationModal = {
  question: Question;
  isOpen: boolean;
  additionalData?: string; // Add fields as needed
};

export interface DeleteResponse {
  success: boolean;
  message: string;
}
