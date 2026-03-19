import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const candidate = await prisma.candidate.findUnique({
    where: { id },
  });
  if (!candidate) {
    return NextResponse.json(
      { error: "Candidate not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(candidate);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const candidate = await prisma.candidate.update({
    where: { id },
    data: {
      name: body.name,
      photoUrl: body.photoUrl,
      like: body.like,
      love: body.love,
      care: body.care,
      haha: body.haha,
      wow: body.wow,
      sad: body.sad,
      angry: body.angry,
    },
  });

  return NextResponse.json(candidate);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.candidate.delete({
    where: { id },
  });
  return NextResponse.json({ success: true });
}
