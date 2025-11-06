export interface PartnerRequest {
  link: string;
  images: File[];
  description: string;
}

export interface PartnerImage {
  id: number;
  link: string;
}

export interface Partner {
  id: number;
  link: string;
  images: PartnerImage[];
  is_premium: boolean;
  description: string;
}

export interface PartnerResponse {
  success: boolean;
  message: string;
  result: Partner[];
}

export interface SinglePartnerResponse {
  success: boolean;
  message: string;
  data: Partner;
}
