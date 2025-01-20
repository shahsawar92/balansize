export const mockUsers: User[] = Array.from({ length: 50 }, (_, index) => ({
  id: `user-${index + 1}`,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  plan:
    index % 3 === 0
      ? "Basic Plan (149/Year)"
      : index % 3 === 1
        ? "Pro Plan (299/Year)"
        : "Enterprise Plan (499/Year)",
}));
