import { usePathname } from "next/navigation";

import logger from "@/lib/logger";

import { navigationItems } from "@/components/dashboard/Sidebar/navigation-items";

export function useCurrentNavigation() {
  const pathname = usePathname();

  const currentItem = navigationItems
    .filter((item) => pathname.startsWith(item.path))
    .sort((a, b) => b.path.length - a.path.length)
    .shift();

  logger(currentItem, "currentItem");
  return currentItem?.label ?? "Dashboard";
}
