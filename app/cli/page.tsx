import type { Metadata } from "next";
import { TerminalEngine } from "@/components/developer-terminal";
import { USER } from "@/features/profile/data/user";

export const metadata: Metadata = {
  title: `mnsh CLI — Interactive Developer Terminal`,
  description: `Interactive terminal CLI for ${USER.displayName}. Explore featured projects, tech stack, blog posts, gear, and developer tools from the command line.`,
  openGraph: {
    title: `mnsh CLI — ${USER.displayName}`,
    description: `Interactive terminal CLI for ${USER.displayName}. Explore featured projects, tech stack, blog posts, and tools from the command line.`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `mnsh CLI — Interactive Developer Terminal`,
    description: `Interactive terminal CLI for ${USER.displayName}.`,
  },
};

export default function CliPage() {
  return (
    <main className="fixed inset-0 h-[100dvh] w-screen overflow-hidden bg-[#090d0a] flex flex-col select-text">
      <TerminalEngine standalone={true} />
    </main>
  );
}
