export interface Notification {
  id?: number;
  title: number;
  message: string;
  icon: string;
  isActive: boolean;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  result: Notification[];
}

export interface SingleNotificationResponse {
  success: boolean;
  message: string;
  result: Notification;
}

export interface NotificationRequest {
  title: number;
  message: string;
  icon: File | null;
  isTrue: boolean;
}
