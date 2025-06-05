export interface Expert {
  expert_id: number;
  expert_name: string;
  about: string;
  designation: string;
  profile_picture: string | File;
  category_id?: number;
  category_name?: string;
  calendly_link?: string;
  tags?: string[];
  type?: string;
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

export interface ExpertType {
  id: number;
  type: string;
}

export interface ExpertTypeResponse {
  success: boolean;
  message: string;
  result: ExpertType[];
}

export interface SingleExpertTypeResponse {
  success: boolean;
  message: string;
  result: ExpertType;
}

export interface ExpertTypeRequest {
  type: string;
}
