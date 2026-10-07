import { cn } from "@/lib/utils";

const GRADIENT_ANGLES = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
};

// Subtle, smooth U-shape arch mask with a feathered top-to-bottom fade
const U_ARCH_MASK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='white' stop-opacity='0'/%3E%3Cstop offset='25%25' stop-color='white' stop-opacity='0.4'/%3E%3Cstop offset='65%25' stop-color='white' stop-opacity='0.85'/%3E%3Cstop offset='100%25' stop-color='white' stop-opacity='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M 0,0 Q 50,14 100,0 L 100,100 L 0,100 Z' fill='url(%23g)'/%3E%3C/svg%3E")`;

export interface ProgressiveBlurProps {
  direction?: "top" | "right" | "bottom" | "left";
  blurLayers?: number;
  className?: string;
  blurIntensity?: number;
  tint?: string;
  shape?: "linear" | "u-shape";
}

export function ProgressiveBlur({
  direction = "bottom",
  blurLayers = 8,
  className,
  blurIntensity = 6,
  tint,
  shape = "linear",
}: ProgressiveBlurProps) {
  const layers = Math.max(blurLayers, 2);
  const segmentSize = 1 / (blurLayers + 1);

  return (
    <div className={cn("relative pointer-events-none select-none", className)} aria-hidden="true">
      {/* 8-layer progressive backdrop blur ladder - direct on DOM without parent mask so backdrop-filter is 100% active */}
      {Array.from({ length: layers }).map((_, index) => {
        const angle = GRADIENT_ANGLES[direction];
        const gradientStops = [
          index * segmentSize,
          (index + 1) * segmentSize,
          (index + 2) * segmentSize,
          (index + 3) * segmentSize,
        ].map(
          (pos, posIndex) =>
            `rgba(255, 255, 255, ${posIndex === 1 || posIndex === 2 ? 1 : 0}) ${pos * 100}%`
        );

        const gradient = `linear-gradient(${angle}deg, ${gradientStops.join(", ")})`;

        return (
          <div
            key={index}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${index * blurIntensity}px)`,
              WebkitBackdropFilter: `blur(${index * blurIntensity}px)`,
            }}
          />
        );
      })}

      {/* Dark frosted glass tint - gives the blackish tone on white backgrounds with subtle U-shape arch */}
      {tint && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background: tint,
            ...(shape === "u-shape"
              ? {
                  maskImage: U_ARCH_MASK,
                  WebkitMaskImage: U_ARCH_MASK,
                  maskSize: "100% 100%",
                  WebkitMaskSize: "100% 100%",
                }
              : {}),
          }}
        />
      )}
    </div>
  );
}
