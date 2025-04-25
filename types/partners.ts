export interface PartnerRequest {
  link: string;
  logo: File;
}

export interface Partner {
  id: number;
  link: string;
  logo: string;
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
