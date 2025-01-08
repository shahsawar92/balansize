export interface Feature {
  id: string;
  text: string;
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  price: number;
  interval: string;
  features: Feature[];
  className?: string;
  trail?: string;
  isActive?: boolean;
  isRecommended?: boolean;
}
