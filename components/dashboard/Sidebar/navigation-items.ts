import {
  AcademicCapIcon,
  BookOpenIcon,
  CreditCardIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  RectangleGroupIcon,
  TvIcon,
  UserGroupIcon,
  UserIcon,
  UsersIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

export const navigationItems = [
  {
    label: "Home",
    path: "/dashboard",
    icon: HomeIcon,
  },
  {
    label: "User List",
    path: "/dashboard/users",
    icon: UsersIcon,
  },
  {
    label: "Subscriptions",
    path: "/dashboard/subscriptions",
    icon: CreditCardIcon,
  },
  {
    label: "Questionnaire",
    path: "/dashboard/questionnaire",
    icon: QuestionMarkCircleIcon,
  },
  {
    label: "Categories",
    path: "/dashboard/categories",
    icon: BookOpenIcon,
  },
  {
    label: "Articles",
    path: "/dashboard/articles",
    icon: AcademicCapIcon,
  },
  {
    label: "Tags",
    path: "/dashboard/tags",
    icon: RectangleGroupIcon,
  },
  {
    label: "Partners",
    path: "/dashboard/partners",
    icon: UserGroupIcon,
  },
  {
    label: "Experts",
    path: "/dashboard/experts",
    icon: UserIcon,
  },
  {
    label: "Videos",
    path: "/dashboard/videos",
    icon: VideoCameraIcon,
  },
  {
    label: "Courses and Lessons",
    path: "/dashboard/courses",
    icon: TvIcon,
  },
];
