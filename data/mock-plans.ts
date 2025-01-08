import { Plan } from "@/types/plans";

const initialPlans: Plan[] = [
  {
    id: "1",
    title: "Basic plan",
    price: 15,
    interval: "monthly",
    trail: "3 days free trial",
    description: "This is a basic plan",
    features: [
      { id: "1", text: "View wellness tips and articles" },
      { id: "2", text: "Log daily habits and progress" },
    ],
  },
  {
    id: "2",
    title: "Premium plan",
    price: 27,
    interval: "monthly",
    trail: "3 days free trial",
    description: "This is a basic plan",
    features: [
      { id: "1", text: "Everything in Basic plan" },
      { id: "2", text: "Fully personalized self-care routine" },
      { id: "3", text: "In-depth progress tracking and analytics" },
      { id: "4", text: "One-on-one guidance with a virtual coach" },
    ],
  },
  {
    id: "3",
    title: "Basic plan",
    price: 149,
    interval: "yearly",
    trail: "3 days free trial",
    description: "This is a basic plan",
    features: [
      { id: "1", text: "View wellness tips and articles" },
      { id: "2", text: "Log daily habits and progress" },
    ],
  },
  {
    id: "4",
    title: "Premium plan",
    price: 269,
    interval: "yearly",
    trail: "3 days free trial",
    description: "This is a basic plan",
    features: [
      { id: "1", text: "Everything in Basic plan" },
      { id: "2", text: "Fully personalized self-care routine" },
      { id: "3", text: "In-depth progress tracking and analytics" },
      { id: "4", text: "One-on-one guidance with a virtual coach" },
    ],
  },
];

export default initialPlans;
