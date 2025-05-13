export interface Plan {
  plan_name: string;
  content: string;
  plan_duration: string;
  plan_price: string;
  andriod_product_id: string;
  ios_product_id: string;
}

export interface ResPonsePlan extends Plan {
  id: number;
}

export interface PlanResponse {
  result: ResPonsePlan[];
  message?: string;
  success?: boolean;
}

export interface SinglePlanResponse {
  data: Plan;
  message?: string;
  success?: boolean;
}

export interface DeleteResponse {
  message: string;
  success?: boolean;
}
