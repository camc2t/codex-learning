import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/db";

const githubClientId = process.env.GITHUB_ID;
const githubClientSecret = process.env.GITHUB_SECRET;
if (process.env.NODE_ENV !== "production") {
  console.log("NEXTAUTH_ENV", {
    hasGithubId: Boolean(githubClientId),
    hasGithubSecret: Boolean(githubClientSecret),
    hasNextAuthUrl: Boolean(process.env.NEXTAUTH_URL),
    hasNextAuthSecret: Boolean(process.env.NEXTAUTH_SECRET)
  });
}

if (!githubClientId || !githubClientSecret) {
  console.warn("Missing GitHub OAuth env vars.");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV !== "production",
  logger: {
    error(code, metadata) {
      console.error("NEXTAUTH_ERROR", code, metadata);
    },
    warn(code) {
      console.warn("NEXTAUTH_WARN", code);
    },
    debug(code, metadata) {
      console.debug("NEXTAUTH_DEBUG", code, metadata);
    }
  },
  events: {
    async error(message) {
      console.error("NEXTAUTH_EVENT_ERROR", message);
    }
  },
  providers: [
    GitHubProvider({
      clientId: githubClientId ?? "",
      clientSecret: githubClientSecret ?? "",
      profile(profile) {
        const fallbackEmail = `${profile.id}+${profile.login}@users.noreply.github.com`;
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email ?? fallbackEmail,
          image: profile.avatar_url
        };
      }
    })
  ],
  session: {
    strategy: "database"
  },
  pages: {
    signIn: "/signin"
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  }
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
