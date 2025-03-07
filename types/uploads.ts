export interface UploadResponse {
  success: boolean;
  message: string;
  fileUrl?: string;
}

export interface FileUploaderProps {
  onUploadSuccess?: (fileUrl: string) => void;
}
