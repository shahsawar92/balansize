export interface Community {
  id: number;
  link: string;
  description: string;
  logo: string | File; // string when receiving from API, File when sending via form
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
