export interface Community {
  id: number;
  link: string;
  description: string;
  images?: { id: number; link: string }[];
}

export interface CommunityListResponse {
  success: boolean;
  message: string;
  result: Community[];
}

export interface SingleCommunityResponse {
  success: boolean;
  message: string;
  data: Community;
}
