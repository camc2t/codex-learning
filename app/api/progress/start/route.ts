import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await request.json();
  const { stepId } = body as { stepId: string };

  const existing = await prisma.progress.findUnique({
    where: { userId_stepId: { userId: session.user.id, stepId } }
  });

  if (!existing) {
    await prisma.progress.create({
      data: {
        userId: session.user.id,
        stepId,
        status: "in_progress",
        startedAt: new Date()
      }
    });
  } else if (existing.status !== "completed") {
    await prisma.progress.update({
      where: { userId_stepId: { userId: session.user.id, stepId } },
      data: { status: "in_progress", startedAt: new Date() }
    });
  }

  return NextResponse.json({ ok: true });
}
