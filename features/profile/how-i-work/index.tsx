import { Lightbulb, MapTrifold as Map, Palette, Rocket, Code, ArrowsOutCardinal as Scaling } from "@phosphor-icons/react";
import { Panel, PanelHeader, PanelTitle } from "../components/panel";
import { cn } from "@/lib/utils";


const STEPS = [
    {
        id: 1,
        title: "Discovery",
        description: "Understanding your vision, goals, and target audience.",
        icon: Lightbulb,
    },
    {
        id: 2,
        title: "Strategy",
        description: "Planning the roadmap, architecture, and user experience.",
        icon: Map,
    },
    {
        id: 3,
        title: "Design",
        description: "Crafting beautiful, intuitive, and accessible interfaces.",
        icon: Palette,
    },
    {
        id: 4,
        title: "Development",
        description: "Building robust, scalable, and high-performance solutions.",
        icon: Code,
    },
    {
        id: 5,
        title: "Launch",
        description: "Deploying to production and ensuring everything runs smoothly.",
        icon: Rocket,
    },
    {
        id: 6,
        title: "Growth",
        description: "Monitoring performance and scaling based on user feedback.",
        icon: Scaling,
    }
];

export default function HowIWork() {
    // We can just use STEPS directly now since we have 6 items
    const items = STEPS;

    return (
        <Panel id="how-i-work">
            <PanelHeader>
                <PanelTitle>How I Work ?</PanelTitle>
            </PanelHeader>

            <div className="relative w-full">
                {/* Dotted Pattern Background */}
                <div className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(var(--edge) 1px, transparent 1px)",
                        backgroundSize: "16px 16px"
                    }}
                />

                <div className="relative z-10 mx-auto flex w-full max-w-fit flex-col items-center p-6 md:p-6">
                    {/* Grid Container */}
                    <div className="grid w-full grid-cols-1 gap-px bg-edge sm:grid-cols-2 lg:grid-cols-3 border border-edge">
                        {items.map((step, index) => {
                            return (
                                <div
                                    key={step.id}
                                    className={cn(
                                        "group relative flex flex-col items-start justify-center gap-3 bg-background p-6 text-left transition-all hover:bg-muted/50",
                                        "w-full min-h-[180px]",
                                    )}
                                >
                                    <div className="flex h-10 w-10 items-center justify-center border border-edge bg-background text-foreground shadow-sm">
                                        <step.icon size={18} strokeWidth={1.5} />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                            0{index + 1}
                                        </span>
                                        <h3 className="text-lg font-semibold text-foreground tracking-tight">{step.title}</h3>
                                        <p className="max-w-[240px] text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Panel>
    );
}


