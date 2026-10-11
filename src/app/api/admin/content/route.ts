import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getContent, saveContent, validateContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ content: await getContent() });
}

export async function PUT(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let content: unknown;
  try {
    ({ content } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validationError = validateContent(content);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  await saveContent(content as Parameters<typeof saveContent>[0]);
  return NextResponse.json({ ok: true });
}
