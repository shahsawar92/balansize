import { Category } from "./categories-types";

export interface Course {
  course_id: number;
  title: string;
  featured_image: string;
  content: string;
  is_premium: boolean;
  is_publish: boolean;
  expert: {
    id: number;
    name: string;
  };
  category: Category;
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
