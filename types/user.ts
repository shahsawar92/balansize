export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
}

export type Column<T> = {
  header: string;
  accessor: keyof T | ((data: T) => string | number);
  sortable: boolean;
  cell?: (data: T) => JSX.Element; // Changed 'user: User' to 'data: T'
};
