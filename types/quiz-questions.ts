export interface QuizQuestion {
  id?: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: string;
  category_id: number;
}

export interface QuizQuestionResponse {
  success: boolean;
  message: string;
  result: QuizQuestion[];
}

export interface QuizQuestionRequest {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: string;
  category_id: number | undefined;
}

export interface QuizQuestionSingleResponse {
  success: boolean;
  message: string;
  result: QuizQuestion;
}
