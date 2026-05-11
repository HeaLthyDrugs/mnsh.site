"use client";

import { motion } from "framer-motion";
import { SOURCE_CODE_GITHUB_URL } from "@/config/site";

const BUILD_VIDEO_URL = "https://youtube.com/@HeaLthyDrugs";
const INSPIRATION_URL = "https://mnsh.online/";

export function SiteFooterCredit() {
  return (
    <section className="max-w-screen overflow-x-hidden px-2 pb-8">
      <div className="mx-auto border-x border-b border-edge md:max-w-3xl">
        <div className="bg-[linear-gradient(to_bottom,transparent,rgba(127,127,127,0.04))] px-5 py-5 text-center md:px-16">
          <div className="mb-4 flex justify-center">
            <HeartIcon />
          </div>
          <p className="mt-2 text-balance text-sm font-heading text-muted-foreground/60 md:text-base">
            Website heavily inspired by{" "}
            <FooterCreditLink href={INSPIRATION_URL}>Chánh Đại</FooterCreditLink>.
          </p>
          <p className="text-balance text-sm font-heading text-muted-foreground/60 md:text-base">
            Learning as I build. Here&apos;s the{" "}
            <FooterCreditLink href={SOURCE_CODE_GITHUB_URL}>code</FooterCreditLink>{" "}
          </p>

        </div>
      </div>
    </section>
  );
}

function FooterCreditLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      className="inline-flex text-muted-foreground/60 hover:text-primary transition-colors duration-200 underline underline-offset-2 decoration-muted-foreground/30 hover:decoration-primary"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

function HeartIcon() {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-5 text-red-500 cursor-pointer drop-shadow-sm"
      whileHover={{ scale: 1.3, rotate: 5 }}
      whileTap={{ scale: 0.8, rotate: -10 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <path d="M10.4107 19.9677C7.58942 17.858 2 13.0348 2 8.69444C2 5.82563 4.10526 3.5 7 3.5C8.5 3.5 10 4 12 6C14 4 15.5 3.5 17 3.5C19.8947 3.5 22 5.82563 22 8.69444C22 13.0348 16.4106 17.858 13.5893 19.9677C12.6399 20.6776 11.3601 20.6776 10.4107 19.9677Z" />
    </motion.svg>
  );
}
