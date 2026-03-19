import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const candidates = await prisma.candidate.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(candidates);
}

export async function POST(request: Request) {
  const body = await request.json();

  const candidate = await prisma.candidate.create({
    data: {
      name: body.name,
      photoUrl: body.photoUrl,
      like: body.like ?? 0,
      love: body.love ?? 0,
      care: body.care ?? 0,
      haha: body.haha ?? 0,
      wow: body.wow ?? 0,
      sad: body.sad ?? 0,
      angry: body.angry ?? 0,
    },
  });

  return NextResponse.json(candidate, { status: 201 });
}
