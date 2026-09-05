"use client";

import { motion } from "motion/react";
import type { MouseEvent } from "react";
import { useRef } from "react";
import { SOURCE_CODE_GITHUB_URL } from "@/config/site";
import { USER } from "@/features/profile/data/user";
import {
  Confetti,
  type ConfettiRef,
  getNextHeartConfettiVariant,
} from "@/components/ui/confetti";
import { useSound } from "@/hooks/use-sound";
import { SimpleTooltip } from "@/components/ui/tooltip";

const INSPIRATION_URL = "https://chanhdai.com";

export function SiteFooterCredit() {
  const confettiRef = useRef<ConfettiRef>(null);
  const previousVariantRef = useRef<number | null>(null);
  const playHover = useSound("/sounds/hover.wav");
  const playTap = useSound("/sounds/tap.wav");

  const handleHeartPress = (event: MouseEvent<HTMLButtonElement>) => {
    playTap();
    const { variant, options } = getNextHeartConfettiVariant(previousVariantRef.current);
    previousVariantRef.current = variant;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    confettiRef.current?.fire({
      ...options,
      origin: {
        x: x / window.innerWidth,
        y: y / window.innerHeight,
      },
    });
  };

  return (
    <>
      <Confetti
        ref={confettiRef}
        manualstart
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-screen w-screen"
      />
      <section className="max-w-screen overflow-x-hidden px-2 pb-8">
        <div className="relative mx-auto overflow-hidden border-x border-b border-edge md:max-w-3xl">
          <div className="relative z-10 space-y-3 bg-[linear-gradient(to_bottom,transparent,rgba(127,127,127,0.04))] px-5 py-6 text-center md:px-16">
            <div className="flex justify-center">
              <SimpleTooltip content="Confetti">
                <div>
                  <HeartIcon onPress={handleHeartPress} onMouseEnter={playHover} />
                </div>
              </SimpleTooltip>
            </div>

            <div className="space-y-1 text-xs md:text-sm text-muted-foreground font-heading">
              <p className="text-balance">
                Inspired by{" "}
                <FooterCreditLink href={INSPIRATION_URL}>Chánh Đại</FooterCreditLink>.
              </p>
              <p className="text-balance">
                Source code on{" "}
                <FooterCreditLink href={SOURCE_CODE_GITHUB_URL}>GitHub</FooterCreditLink>.
              </p>
            </div>

            <div className="pt-2 text-[11px] font-mono text-muted-foreground/50">
              <span>&copy; {new Date().getFullYear()} {USER.fullName}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FooterCreditLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const playHover = useSound("/sounds/hover.wav");
  const playTap = useSound("/sounds/tap.wav");

  return (
    <a
      className="inline-flex font-medium text-foreground underline underline-offset-3 decoration-muted-foreground/30 transition-colors duration-200 hover:text-primary hover:decoration-primary"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={playHover}
      onClick={playTap}
    >
      {children}
    </a>
  );
}

function HeartIcon({
  onPress,
  onMouseEnter,
}: {
  onPress: (event: MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-label="Celebrate with confetti"
      className="cursor-pointer text-red-500 drop-shadow-sm outline-none"
      onClick={onPress}
      onMouseEnter={onMouseEnter}
      whileHover={{ scale: 1.3, rotate: 5 }}
      whileTap={{ scale: 0.8, rotate: -10 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5"
      >
        <path d="M10.4107 19.9677C7.58942 17.858 2 13.0348 2 8.69444C2 5.82563 4.10526 3.5 7 3.5C8.5 3.5 10 4 12 6C14 4 15.5 3.5 17 3.5C19.8947 3.5 22 5.82563 22 8.69444C22 13.0348 16.4106 17.858 13.5893 19.9677C12.6399 20.6776 11.3601 20.6776 10.4107 19.9677Z" />
      </svg>
    </motion.button>
  );
}
