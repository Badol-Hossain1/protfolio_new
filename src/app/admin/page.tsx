import type { Metadata } from "next";
import { AdminEditor } from "@/app/admin/AdminEditor";
import { AdminLogin } from "@/app/admin/AdminLogin";
import { isAuthed, isDefaultPassword } from "@/lib/auth";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAuthed())) {
    return <AdminLogin showDefaultWarning={isDefaultPassword()} />;
  }

  const content = await getContent();
  return <AdminEditor initialContent={content} />;
}
