import {
  AcademicCapIcon,
  BookOpenIcon,
  CreditCardIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
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
    label: "Videos",
    path: "/dashboard/videos",
    icon: VideoCameraIcon,
  },
];
