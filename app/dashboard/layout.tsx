import { ReactNode } from "react";

import AuthGuard from "../authGuard";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
