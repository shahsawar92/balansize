export interface User {
  id: string;
  profilePicture: string;
  firstName: string;
  lastName: string;
  email: string;
  plan: string;
}

export type Column<T> = {
  header: string;
  accessor: keyof T | ((data: T) => string | number);
  sortable: boolean;
  cell?: (user: User) => JSX.Element;
};
