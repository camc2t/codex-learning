import "@/styles/globals.css";
import type { Metadata } from "next";
import { AppSessionProvider } from "@/components/SessionProvider";
import { PostHogProvider } from "@/components/PostHogProvider";
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Codex Path",
  description: "Go from zero to a shipped app with Codex guided learning."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${ibmPlexSans.variable}`}>
      <body>
        <PostHogProvider>
          <AppSessionProvider>{children}</AppSessionProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
