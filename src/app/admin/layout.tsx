import type { Metadata } from "next";
import { AdminLanguageProvider } from "@/components/admin/AdminLanguageContext";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLanguageProvider>{children}</AdminLanguageProvider>;
}
