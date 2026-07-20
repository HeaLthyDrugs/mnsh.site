import type { TOCItemType } from "fumadocs-core/toc";

const GUIDE_STEP = 24;
const GUIDE_INSET = 8;
/** X center of the vertical guide within each 24px column */
const GUIDE_X = 12;
const STROKE = 1.5;
/** Corner radius in px — fixed (never stretched) for a true circular elbow */
const RADIUS = 8;

/** Opaque guide color — avoids dark spots when strokes meet (unlike black/10) */
const GUIDE_COLOR = "text-zinc-300 dark:text-zinc-600";
const GUIDE_BG = "bg-zinc-300 dark:bg-zinc-600";

function getDepth(item: TOCItemType) {
  return Math.max(item.depth - 2, 0);
}

function hasSiblingAtDepth(
  items: TOCItemType[],
  fromIndex: number,
  depth: number,
) {
  for (let i = fromIndex + 1; i < items.length; i++) {
    const nextDepth = getDepth(items[i]);
    if (nextDepth === depth) return true;
    if (nextDepth < depth) return false;
  }
  return false;
}

/**
 * File-tree guides for nested TOC items.
 *
 * Continuous paths (no visual breaks between segments or rows).
 * Opaque stroke colors so joints never stack into darker blotches
 * the way translucent black/10 strokes do.
 */
export function TocTreeGuides({
  items,
  index,
  depth,
}: {
  items: TOCItemType[];
  index: number;
  depth: number;
}) {
  if (depth <= 0) return null;

  const isLastInGroup = !hasSiblingAtDepth(items, index, depth);
  const columnLeft = (depth - 1) * GUIDE_STEP + GUIDE_INSET;

  // Quarter-circle elbow + horizontal arm (fixed-px SVG → true circular radius)
  const elbowPath = `M ${GUIDE_X} 0 A ${RADIUS} ${RADIUS} 0 0 0 ${GUIDE_X + RADIUS} ${RADIUS} H ${GUIDE_STEP}`;

  return (
    <>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 w-6 ${GUIDE_COLOR}`}
        style={{ left: columnLeft }}
      >
        {isLastInGroup ? (
          <>
            {/* └ stem: top → elbow (meets arc flush) */}
            <svg
              width={GUIDE_STEP}
              className="absolute top-0 left-0 overflow-visible"
              style={{ height: `calc(50% - ${RADIUS}px)` }}
              fill="none"
            >
              <line
                x1={GUIDE_X}
                y1={0}
                x2={GUIDE_X}
                y2="100%"
                stroke="currentColor"
                strokeWidth={STROKE}
                strokeLinecap="square"
              />
            </svg>
            {/* └ elbow + arm — continuous curve into the label */}
            <svg
              width={GUIDE_STEP}
              height={RADIUS + STROKE}
              className="absolute left-0 overflow-visible"
              style={{ top: `calc(50% - ${RADIUS}px)` }}
              fill="none"
            >
              <path
                d={elbowPath}
                stroke="currentColor"
                strokeWidth={STROKE}
                strokeLinecap="butt"
                strokeLinejoin="round"
                shapeRendering="geometricPrecision"
              />
            </svg>
          </>
        ) : (
          <>
            {/* ├ full spine — edge-to-edge so sibling rows stay connected */}
            <svg
              width={GUIDE_STEP}
              className="absolute inset-y-0 left-0 h-full overflow-visible"
              fill="none"
            >
              <line
                x1={GUIDE_X}
                y1={0}
                x2={GUIDE_X}
                y2="100%"
                stroke="currentColor"
                strokeWidth={STROKE}
                strokeLinecap="square"
              />
            </svg>
            {/* ├ branch — opaque meet with spine (no dark T-junction) */}
            <svg
              width={GUIDE_STEP}
              height={RADIUS + STROKE}
              className="absolute left-0 overflow-visible"
              style={{ top: `calc(50% - ${RADIUS}px)` }}
              fill="none"
            >
              <path
                d={elbowPath}
                stroke="currentColor"
                strokeWidth={STROKE}
                strokeLinecap="butt"
                strokeLinejoin="round"
                shapeRendering="geometricPrecision"
              />
            </svg>
          </>
        )}
      </div>

      {/* Ancestor spines — continuous through deeper rows */}
      {depth > 1 &&
        Array.from({ length: depth - 1 }).map((_, i) => {
          const parentDepth = i + 1;
          if (!hasSiblingAtDepth(items, index, parentDepth)) return null;

          return (
            <div
              key={i}
              aria-hidden
              className={`pointer-events-none absolute top-0 bottom-0 ${GUIDE_BG}`}
              style={{
                left: i * GUIDE_STEP + GUIDE_INSET + GUIDE_X - STROKE / 2,
                width: STROKE,
              }}
            />
          );
        })}
    </>
  );
}

export function getTocItemDepth(item: TOCItemType) {
  return getDepth(item);
}

export const TOC_GUIDE_STEP = GUIDE_STEP;
export const TOC_GUIDE_INSET = GUIDE_INSET;
