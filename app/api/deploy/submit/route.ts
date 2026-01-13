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
  const { url, stepId } = body as { url: string; stepId: string };

  await prisma.progress.upsert({
    where: { userId_stepId: { userId: session.user.id, stepId } },
    create: {
      userId: session.user.id,
      stepId,
      status: "completed",
      completedAt: new Date(),
      deployUrl: url
    },
    update: {
      status: "completed",
      completedAt: new Date(),
      deployUrl: url
    }
  });

  return NextResponse.json({ ok: true });
}
