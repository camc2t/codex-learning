import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import vm from "node:vm";

const TIMEOUT_MS = 500;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ pass: false, output: "Not signed in." }, { status: 401 });
  }

  const body = await request.json();
  const { code, expectedOutput, stepId } = body as {
    code: string;
    expectedOutput: string;
    stepId: string;
  };

  let output = "";
  const sandboxConsole = {
    log: (...args: unknown[]) => {
      output += `${args.join(" ")}` + "\n";
    }
  };

  try {
    const script = new vm.Script(code);
    const context = vm.createContext({ console: sandboxConsole });
    script.runInContext(context, { timeout: TIMEOUT_MS });
  } catch (error) {
    output += `Error: ${(error as Error).message}`;
  }

  const normalized = output.trim();
  const pass = normalized === expectedOutput.trim();

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

  return NextResponse.json({ pass, output: normalized });
}
