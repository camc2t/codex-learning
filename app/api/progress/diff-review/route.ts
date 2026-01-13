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
  const { stepId, checked } = body as { stepId: string; checked: boolean };

  await prisma.progress.upsert({
    where: { userId_stepId: { userId: session.user.id, stepId } },
    create: {
      userId: session.user.id,
      stepId,
      status: "in_progress",
      diffReviewCompleted: checked
    },
    update: {
      diffReviewCompleted: checked
    }
  });

  return NextResponse.json({ ok: true });
}
