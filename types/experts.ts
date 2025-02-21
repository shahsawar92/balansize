export interface Expert {
  id: number;
  name: string;
  about: string;
  designation: string;
  profile_picture: string;
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
  profile_picture?: string;
}
