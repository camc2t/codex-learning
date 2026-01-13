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
  const { stepId, prompt } = body as { stepId: string; prompt: string };

  await prisma.promptHistory.create({
    data: {
      userId: session.user.id,
      stepId,
      prompt
    }
  });

  return NextResponse.json({ ok: true });
}
