import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/db";

const githubClientId = process.env.GITHUB_ID;
const githubClientSecret = process.env.GITHUB_SECRET;

if (!githubClientId || !githubClientSecret) {
  console.warn("Missing GitHub OAuth env vars.");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
