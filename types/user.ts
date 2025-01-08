export interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
}

export type Column<T> = {
  header: string;
  accessor: keyof T | ((data: T) => string | number);
  sortable: boolean;
  cell?: (user: User) => JSX.Element;
};
