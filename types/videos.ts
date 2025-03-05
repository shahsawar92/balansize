export interface Video {
  video_id: number;
  title: string;
  type: string;
  link: string;
  thumbnail: string;
  category: {
    id: number;
    name: string;
  };
  expert: {
    id: number;
    name: string;
  };
  tags: string[];
}

export interface VideoResponse {
  success: boolean;
  message: string;
  data: Video[];
}

export interface SingleVideoResponse {
  success: boolean;
  message: string;
  data: Video;
}
