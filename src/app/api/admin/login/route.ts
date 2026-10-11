import { NextResponse } from "next/server";
import { checkPassword, signIn } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof password !== "string" || !checkPassword(password)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  await signIn();
  return NextResponse.json({ ok: true });
}
