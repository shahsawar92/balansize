export interface Expert {
  id: number;
  name: string;
  about: string;
  designation: string;
  profile_picture: string | File;
  categoryId?: number;
}

export interface ExpertResponse {
  success: boolean;
  message: string;
  result: Expert[];
}

export interface ExpertRequest {
  name: string;
  about: string;
  designation: string;
  profile_picture?: string | File;
}

export interface singleExpertResponse {
  success: boolean;
  message: string;
  result: Expert;
}
