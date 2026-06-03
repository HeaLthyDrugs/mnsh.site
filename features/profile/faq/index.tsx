"use client";

import { useSound } from "@/hooks/use-sound";

import { Panel, PanelHeader, PanelTitle } from "../components/panel";
import { FAQS } from "../data/faqs";
import { USER } from "../data/user";
import { FaqItem } from "./faq-item";

// Server-side compatible base64 decoding
function decodeBase64(str: string): string {
    if (typeof window !== "undefined") {
        return atob(str);
    }
    return Buffer.from(str, "base64").toString("utf-8");
}

export default function Faq() {
    const decodedEmail = decodeBase64(USER.email);
    const playHover = useSound("/sounds/hover.wav");
    const playTap = useSound("/sounds/tap.wav");

    return (
        <Panel id="faq">
            <PanelHeader>
                <PanelTitle>FAQs</PanelTitle>
            </PanelHeader>

            {/* FAQ Items - no show more/less button */}
            <div>
                {FAQS.map((item) => (
                    <div key={item.id} className="border-b border-edge last:border-b-0">
                        <FaqItem faq={item} />
                    </div>
                ))}
            </div>

            {/* Contact CTA */}
            <div className="border-t border-edge bg-gradient-to-b from-accent2/30 to-transparent">
                <div className="flex items-stretch justify-center gap-2 px-2">
                    <div className="w-px bg-[repeating-linear-gradient(to_bottom,var(--color-muted-foreground)_0,var(--color-muted-foreground)_3px,transparent_3px,transparent_6px)] opacity-20" />
                    <div className="flex items-center gap-2 py-2">
                        <span className="text-xs font-heading text-muted-foreground/60 whitespace-nowrap">
                            Still have questions?
                        </span>
                        <a
                            href={`mailto:${decodedEmail}`}
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-primary transition-colors duration-200 group whitespace-nowrap"
                            onMouseEnter={playHover}
                            onClick={playTap}
                        >
                            <span className="underline underline-offset-2 decoration-muted-foreground/30 group-hover:decoration-primary">
                                Email me
                            </span>
                            {/* <MailIcon className="size-3 group-hover:scale-110 transition-transform duration-200" /> */}
                        </a>
                    </div>
                    <div className="w-px bg-[repeating-linear-gradient(to_bottom,var(--color-muted-foreground)_0,var(--color-muted-foreground)_3px,transparent_3px,transparent_6px)] opacity-20" />
                </div>
            </div>
        </Panel>
    );
}
