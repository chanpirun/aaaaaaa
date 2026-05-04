"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (
    pathname.startsWith("/member") ||
    pathname.startsWith("/assistant") ||
    pathname.startsWith("/director")
  )
    return null;
  return <Footer />;
}
