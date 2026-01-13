import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ pass: false, message: "Not signed in." }, { status: 401 });
  }

  const body = await request.json();
  const { output, expectedPatterns, stepId } = body as {
    output: string;
    expectedPatterns: string[];
    stepId: string;
  };

  const missing = expectedPatterns.filter((pattern) => {
    try {
      const regex = new RegExp(pattern, "i");
      return !regex.test(output);
    } catch {
      return true;
    }
  });

  const pass = missing.length === 0;

  if (pass) {
    await prisma.progress.upsert({
      where: { userId_stepId: { userId: session.user.id, stepId } },
      create: {
        userId: session.user.id,
        stepId,
        status: "completed",
        completedAt: new Date()
      },
      update: {
        status: "completed",
        completedAt: new Date()
      }
    });
  }

  return NextResponse.json({
    pass,
    message: pass
      ? "All expected patterns found."
      : `Missing: ${missing.join(", ")}`
  });
}
