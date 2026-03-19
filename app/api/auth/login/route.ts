import { NextResponse } from "next/server";
import { validateAdmin, createAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 }
    );
  }

  const valid = await validateAdmin(username, password);
  if (!valid) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  await createAdminSession();
  return NextResponse.json({ success: true });
}
