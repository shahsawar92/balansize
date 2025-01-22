import { User } from "@/types/user";

export const plans = [
  {
    id: 1,
    name: "Basic Plan (149/Year)",
  },
  {
    id: 2,
    name: "Pro Plan (299/Year)",
  },
  {
    id: 3,
    name: "Enterprise Plan (499/Year)",
  },
];

export const mockUsers: User[] = Array.from({ length: 50 }, (_, index) => ({
  id: `user-${index + 1}`,
  firstName: `User ${index + 1}`,
  profilePicture: `/images/avatars/avatar-${(index % 4) + 1}.png`,
  lastName: `Doe ${index + 1}`,
  email: `user${index + 1}@example.com`,
  plan: plans[index % 3].name,
  // plan:
  //   index % 3 === 0
  //     ? "Basic Plan (149/Year)"
  //     : index % 3 === 1
  //       ? "Pro Plan (299/Year)"
  //       : "Enterprise Plan (499/Year)",
}));
