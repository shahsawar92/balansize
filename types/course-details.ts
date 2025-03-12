interface course {
  id: number;
  title: string;
  featured_image: string;
  categoryId: number;
}

interface video {
  id: number;
  title: string;
  link: string;
}

export interface CourseVideo {
  id: number;
  title: string;
  link: string;
  course: course;
}

export interface CourseVideosResponse {
  success: boolean;
  message: string;
  result: CourseVideo[];
}

export interface SingleCourseVideoResponse {
  success: boolean;
  message: string;
  video: CourseVideo;
}

export interface AddCourseVideoRequest {
  courseId: number;
  title: string;
  link: string;
}

export interface UpdateCourseVideoRequest {
  id: number;
  title: string;
  link: string;
}

export interface DeleteCourseVideoResponse {
  success: boolean;
  message: string;
}

export interface CourseById {
  message: string;
  result: {
    course: course;
    details: video[];
  };
  success: boolean;
}
