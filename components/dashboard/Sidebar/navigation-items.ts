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
import { FileQuestion, Table } from "lucide-react";
import path from "path";
import {
  RiNotification2Fill,
  RiNotification2Line,
  RiQuestionAnswerLine,
  RiQuestionLine,
  RiQuestionnaireLine,
} from "react-icons/ri";

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
    label: "Quiz Questions",
    path: "/dashboard/quiz-questions",
    icon: FileQuestion,
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
    label: "Onboarding",
    path: "/dashboard/onboarding",
    icon: Table,
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
  {
    label: "Notifications",
    path: "/dashboard/notifications",
    icon: RiNotification2Line,
  },
];
