export interface OnboardingRequest {
  title: string;
  description: string;
  isActive: boolean;
  image: string;
}

export interface OnboardingPartner {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  image: string;
}

export interface OnboardingResponse {
  success: boolean;
  message: string;
  result: OnboardingPartner[];
}

export interface SingleOnboardingResponse {
  success: boolean;
  message: string;
  result: OnboardingPartner;
}
