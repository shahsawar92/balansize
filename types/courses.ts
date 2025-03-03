export interface Course {
  course_id: number;
  title: string;
  featured_image: string;
  expert: {
    id: number;
    name: string;
  };
  category: string | null;
  tags: string[];
}

export interface CourseResponse {
  success: boolean;
  message: string;
  data: Course[];
}

export interface SingleCourseResponse {
  success: boolean;
  message: string;
  data: Course;
}
