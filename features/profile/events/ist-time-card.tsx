"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const TIME_ZONE = "Asia/Kolkata";
const TIME_ZONE_OFFSET_MINUTES = 330;
const LONAVALA_LATITUDE = 18.75;
const LONAVALA_LONGITUDE = 73.41;

interface SceneState {
  hours: string;
  minutes: string;
  period: string;
  solarAltitude: number;
  sunX: number;
  sunY: number;
  moonX: number;
  moonY: number;
  moonOpacity: number;
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

const SKY_PALETTES = {
  night: {
    top: "#172446",
    horizon: "#594e76",
    farHill: "#384565",
    nearHill: "#283651",
    grass: "#9bb9a8",
  },
  dawn: {
    top: "#315a91",
    horizon: "#efa58f",
    farHill: "#7185a3",
    nearHill: "#485b78",
    grass: "#a6a98f",
  },
  day: {
    top: "#55b7e7",
    horizon: "#f9d69c",
    farHill: "#78a986",
    nearHill: "#477a68",
    grass: "#bad68f",
  },
  dusk: {
    top: "#495b94",
    horizon: "#f2947a",
    farHill: "#77718d",
    nearHill: "#4a4b6d",
    grass: "#b2968e",
  },
} satisfies Record<string, Record<string, string>>;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180;
}

function radiansToDegrees(value: number) {
  return (value * 180) / Math.PI;
}

function getIstParts(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const hour = Number(values.hour);
  const minute = Number(values.minute);
  const year = Number(values.year);
  const month = Number(values.month);
  const day = Number(values.day);

  return {
    year,
    month,
    day,
    hour,
    minute,
    displayHour: String(hour % 12 || 12).padStart(2, "0"),
    period: hour >= 12 ? "PM" : "AM",
  };
}

/** Approximate solar position using the date, IST time, and Lonavala coordinates. */
function getSceneState(now: Date): SceneState {
  const { year, month, day, hour, minute } = getIstParts(now);
  const displayHour = String(hour % 12 || 12).padStart(2, "0");
  const period = hour >= 12 ? "PM" : "AM";
  const dayOfYear = Math.floor(
    (Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / 86_400_000
  );
  const localMinutes = hour * 60 + minute;
  const daysInYear = new Date(Date.UTC(year, 1, 29)).getUTCDate() === 29 ? 366 : 365;
  const fractionalYear =
    (2 * Math.PI / daysInYear) * (dayOfYear - 1 + (localMinutes / 60 - 12) / 24);
  const equationOfTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(fractionalYear) -
      0.032077 * Math.sin(fractionalYear) -
      0.014615 * Math.cos(2 * fractionalYear) -
      0.040849 * Math.sin(2 * fractionalYear));
  const solarDeclination =
    0.006918 -
    0.399912 * Math.cos(fractionalYear) +
    0.070257 * Math.sin(fractionalYear) -
    0.006758 * Math.cos(2 * fractionalYear) +
    0.000907 * Math.sin(2 * fractionalYear) -
    0.002697 * Math.cos(3 * fractionalYear) +
    0.00148 * Math.sin(3 * fractionalYear);
  const solarTimeMinutes =
    (localMinutes +
      equationOfTime +
      4 * LONAVALA_LONGITUDE -
      TIME_ZONE_OFFSET_MINUTES +
      1440) %
    1440;
  const hourAngle = degreesToRadians(solarTimeMinutes / 4 - 180);
  const latitude = degreesToRadians(LONAVALA_LATITUDE);
  const altitude = Math.asin(
    Math.sin(latitude) * Math.sin(solarDeclination) +
      Math.cos(latitude) * Math.cos(solarDeclination) * Math.cos(hourAngle)
  );
  const solarAltitude = radiansToDegrees(altitude);

  const sunriseHourAngle = Math.acos(
    clamp(-Math.tan(latitude) * Math.tan(solarDeclination), -1, 1)
  );
  const solarNoon =
    720 - 4 * LONAVALA_LONGITUDE - equationOfTime + TIME_ZONE_OFFSET_MINUTES;
  const sunrise = solarNoon - radiansToDegrees(sunriseHourAngle) * 4;
  const sunset = solarNoon + radiansToDegrees(sunriseHourAngle) * 4;
  const daylightProgress = clamp((localMinutes - sunrise) / (sunset - sunrise), 0, 1);
  const nightDuration = sunrise + 1440 - sunset;
  const minutesSinceSunset = (localMinutes - sunset + 1440) % 1440;
  const isMoonAboveHorizon = minutesSinceSunset <= nightDuration;
  const moonProgress = clamp(minutesSinceSunset / nightDuration, 0, 1);
  const maxAltitude = Math.max(
    1,
    90 - Math.abs(LONAVALA_LATITUDE - radiansToDegrees(solarDeclination))
  );

  return {
    hours: displayHour,
    minutes: String(minute).padStart(2, "0"),
    period,
    solarAltitude,
    sunX: 28 + daylightProgress * 344,
    sunY: 143 - clamp(solarAltitude / maxAltitude, 0, 1) * 91,
    moonX: 18 + Math.sqrt(moonProgress) * 77,
    moonY: 70 - Math.sin(moonProgress * Math.PI) * 47,
    moonOpacity: isMoonAboveHorizon ? clamp((-solarAltitude - 1) / 8, 0, 1) : 0,
  };
}

function hexToRgb(hex: string): RgbColor {
  const value = hex.replace("#", "");
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function mixColor(start: string, end: string, amount: number) {
  const from = hexToRgb(start);
  const to = hexToRgb(end);
  const channel = (key: keyof RgbColor) =>
    Math.round(from[key] + (to[key] - from[key]) * amount);

  return `rgb(${channel("r")} ${channel("g")} ${channel("b")})`;
}

function getSkyPalette(solarAltitude: number, isEvening: boolean) {
  const twilight = isEvening ? SKY_PALETTES.dusk : SKY_PALETTES.dawn;

  if (solarAltitude < -8) {
    const amount = clamp((solarAltitude + 18) / 10, 0, 1);
    return Object.fromEntries(
      Object.keys(SKY_PALETTES.night).map((key) => [
        key,
        mixColor(
          SKY_PALETTES.night[key as keyof typeof SKY_PALETTES.night],
          twilight[key as keyof typeof twilight],
          amount
        ),
      ])
    ) as Record<keyof typeof SKY_PALETTES.night, string>;
  }

  if (solarAltitude < 10) {
    const amount = clamp((solarAltitude + 8) / 18, 0, 1);
    return Object.fromEntries(
      Object.keys(SKY_PALETTES.day).map((key) => [
        key,
        mixColor(
          twilight[key as keyof typeof twilight],
          SKY_PALETTES.day[key as keyof typeof SKY_PALETTES.day],
          amount
        ),
      ])
    ) as Record<keyof typeof SKY_PALETTES.day, string>;
  }

  return SKY_PALETTES.day;
}

function SceneArtwork({ scene }: { scene: SceneState }) {
  const isEvening = scene.solarAltitude < 8 && scene.sunX > 200;
  const palette = getSkyPalette(scene.solarAltitude, isEvening);
  const nightOpacity = clamp((-scene.solarAltitude - 1) / 8, 0, 1);
  const sunOpacity = clamp((scene.solarAltitude + 7) / 5, 0, 1);
  const cloudOpacity = 0.12 + clamp((scene.solarAltitude + 8) / 28, 0, 1) * 0.26;
  const cloudColor = scene.solarAltitude < -8 ? "#d7def5" : "#fff8ed";
  const grassOpacity = 0.52 + clamp((scene.solarAltitude + 8) / 28, 0, 1) * 0.14;
  const grassBlades = [
    "M16 193Q11 181 10 171",
    "M20 194Q18 180 23 168",
    "M25 193Q30 181 35 175",
    "M45 193Q40 180 39 171",
    "M50 194Q50 179 55 168",
    "M56 193Q61 182 66 176",
    "M183 193Q178 181 177 172",
    "M188 194Q187 179 192 168",
    "M194 193Q200 182 205 175",
    "M337 193Q332 181 330 172",
    "M343 194Q343 179 348 168",
    "M350 193Q356 182 361 176",
    "M378 193Q374 180 373 171",
    "M384 194Q384 181 389 171",
  ];

  return (
    <>
      <svg
        aria-hidden="true"
        className="ist-scene pointer-events-none absolute inset-0 size-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 400 200"
      >
        <defs>
          <linearGradient id="ist-sky" x1="0" x2="0" y1="0" y2="1">
            <stop className="ist-color-transition" offset="0%" style={{ stopColor: palette.top }} />
            <stop className="ist-color-transition" offset="100%" style={{ stopColor: palette.horizon }} />
          </linearGradient>
          <radialGradient id="ist-sun-glow">
            <stop offset="0%" stopColor="#fff6c7" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#ffe8a8" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="400" height="200" fill="url(#ist-sky)" />

        <g className="ist-stars" opacity={nightOpacity}>
          {[
            [42, 38, 1.4],
            [91, 67, 1],
            [145, 31, 1.2],
            [193, 58, 1],
            [247, 29, 1.3],
            [286, 68, 1],
            [351, 38, 1.2],
            [376, 82, 0.9],
          ].map(([cx, cy, radius], index) => (
            <circle
              key={`${cx}-${cy}`}
              className={index % 2 === 0 ? "ist-star ist-star-delay" : "ist-star"}
              cx={cx}
              cy={cy}
              fill="#fff4d3"
              r={radius}
            />
          ))}
        </g>

        <g className="ist-cloud ist-cloud-slow" fill={cloudColor} opacity={cloudOpacity}>
          <path d="M92 81c0-4 3-7 7-7 1-6 6-10 12-10 7 0 12 5 13 11 4 0 7 3 7 7 0 4-3 7-7 7H100c-5 0-8-3-8-8Z" />
        </g>
        <g className="ist-cloud ist-cloud-fast" fill={cloudColor} opacity={cloudOpacity * 0.72}>
          <path d="M230 103c0-3 2-5 5-5 1-5 5-8 10-8s9 3 10 8c4 0 6 2 6 5 0 3-2 5-6 5h-20c-3 0-5-2-5-5Z" />
        </g>

        <g className="ist-sun" opacity={sunOpacity}>
          <circle className="ist-sun-glow" cx={scene.sunX} cy={scene.sunY} fill="url(#ist-sun-glow)" r="38" />
          <circle className="ist-sun-core" cx={scene.sunX} cy={scene.sunY} fill="#fff1bd" r="10" />
        </g>

        <path
          d="M0 139 C47 111 79 120 119 137 C163 155 200 111 248 123 C295 135 325 112 400 132 L400 200 L0 200Z"
          fill={palette.farHill}
          className="ist-color-transition"
        />
        <path
          d="M0 158 C54 141 91 153 133 165 C185 180 218 145 270 151 C324 157 349 138 400 151 L400 200 L0 200Z"
          fill={palette.nearHill}
          className="ist-color-transition"
        />
        <path
          d="M0 176 C66 163 115 177 164 184 C226 193 288 163 342 171 C366 174 384 177 400 181 L400 200 L0 200Z"
          fill="#26394a"
          opacity="0.28"
        />
        <g
          className="ist-grass"
          fill="none"
          opacity={grassOpacity}
          stroke={palette.grass}
          strokeLinecap="round"
          strokeWidth="2"
        >
          {grassBlades.map((d, index) => (
            <path
              key={d}
              className={`ist-grass-blade ist-grass-blade-${index % 4}`}
              d={d}
            />
          ))}
        </g>
        <g className="ist-fireflies" opacity={nightOpacity}>
          <circle className="ist-firefly" cx="76" cy="157" fill="#ffe9a6" r="1.5" />
          <circle className="ist-firefly ist-firefly-delay" cx="315" cy="169" fill="#ffe9a6" r="1.3" />
          <circle className="ist-firefly" cx="357" cy="146" fill="#ffe9a6" r="1.2" />
        </g>
      </svg>

      <div
        aria-hidden="true"
        className="ist-moon-position pointer-events-none absolute z-10 size-10 md:size-11"
        style={{
          left: `${scene.moonX}%`,
          top: `${scene.moonY}%`,
          opacity: scene.moonOpacity,
        }}
      >
        <svg className="ist-moon size-full overflow-visible" viewBox="0 0 40 40">
          <defs>
            <mask id="ist-moon-crescent">
              <rect fill="black" height="40" width="40" />
              <circle cx="19" cy="20" fill="white" r="14" />
              <circle cx="25" cy="15" fill="black" r="13" />
            </mask>
            <radialGradient id="ist-moon-glow">
              <stop offset="0%" stopColor="#fff0be" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#fff0be" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="20" cy="20" fill="url(#ist-moon-glow)" r="20" />
          <circle cx="19" cy="20" fill="#fff0be" mask="url(#ist-moon-crescent)" r="14" />
        </svg>
      </div>
    </>
  );
}

export function IstTimeCard({ className }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateTime = () => setNow(new Date());
    updateTime();

    const interval = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const scene = now ? getSceneState(now) : null;
  const useLightLocationText = (scene?.solarAltitude ?? -12) < 5;

  return (
    <div
      className={cn(
        "group relative flex h-full w-full flex-col justify-between overflow-hidden p-4 select-none",
        "bg-[#26394a]",
        className
      )}
    >
      {scene && <SceneArtwork scene={scene} />}

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-slate-950/20 to-transparent",
          "opacity-70"
        )}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-slate-950/45 to-transparent" />

      <div
        className={cn(
          "absolute left-3 top-2.5 z-20 font-mono text-[10px]",
          "transition-colors duration-1000",
          useLightLocationText ? "text-slate-100/65" : "text-slate-900/60"
        )}
        style={{ textShadow: useLightLocationText ? "0 1px 8px rgb(15 23 42 / 40%)" : "0 1px 8px rgb(255 255 255 / 50%)" }}
      >
        <span className="tracking-tight">Lonavala, IN</span>
      </div>

      <div
        aria-label={
          scene ? `${scene.hours}:${scene.minutes} ${scene.period} IST` : "Current IST time"
        }
        className={cn(
          "relative z-20 mt-auto flex items-baseline gap-1.5 font-mono tabular-nums",
          "transition-colors duration-1000",
          "text-white"
        )}
        style={{ textShadow: "0 1px 12px rgb(15 23 42 / 65%)" }}
      >
        <span className="text-2xl font-semibold leading-none sm:text-3xl">
          {scene ? `${scene.hours}:${scene.minutes}` : "--:--"}
        </span>
        <span className="text-xs font-medium tracking-wider opacity-80">
          {scene?.period ?? "IST"}
        </span>
      </div>

      <style jsx>{`
        .ist-color-transition {
          transition: fill 60s linear, stop-color 60s linear;
        }

        .ist-moon-position {
          transform: translate(-50%, -50%);
          transition: left 500ms ease-out, top 500ms ease-out, opacity 1s linear;
        }

        .ist-moon {
          animation: moon-float 5.5s ease-in-out infinite;
        }

        .ist-sun-core {
          transition: cx 30s linear, cy 30s linear;
        }

        .ist-stars {
          transition: opacity 8s linear;
        }

        .ist-cloud {
          animation: cloud-drift 18s ease-in-out infinite alternate;
          transform-box: fill-box;
          transform-origin: center;
          transition: opacity 3s linear, fill 60s linear;
        }

        .ist-grass {
          transition: opacity 3s linear, stroke 60s linear;
        }

        .ist-grass-blade {
          animation: grass-sway 1.9s ease-in-out infinite alternate;
          transform-box: fill-box;
          transform-origin: 50% 100%;
        }

        .ist-grass-blade-1 {
          animation-delay: -0.8s;
        }

        .ist-grass-blade-2 {
          animation-delay: -1.6s;
        }

        .ist-grass-blade-3 {
          animation-delay: -0.4s;
        }

        .ist-fireflies {
          transition: opacity 4s linear;
        }

        .ist-firefly {
          animation: firefly-float 3.6s ease-in-out infinite alternate;
        }

        .ist-firefly-delay {
          animation-delay: -1.8s;
        }

        .ist-cloud-fast {
          animation-duration: 14s;
          animation-delay: -8s;
          animation-direction: alternate-reverse;
        }

        .ist-sun-glow {
          animation: sun-breathe 4.8s ease-in-out infinite alternate;
          transform-box: fill-box;
          transform-origin: center;
        }

        .ist-moon {
          animation: moon-float 5.5s ease-in-out infinite;
          transition: opacity 3s linear;
        }

        .ist-star {
          animation: twinkle 3.8s ease-in-out infinite alternate;
        }

        .ist-star-delay {
          animation-delay: -1.9s;
        }

        @keyframes twinkle {
          from {
            opacity: 0.42;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes cloud-drift {
          from {
            transform: translateX(-8px);
          }
          to {
            transform: translateX(8px);
          }
        }

        @keyframes sun-breathe {
          from {
            transform: scale(0.92);
            opacity: 0.78;
          }
          to {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @keyframes moon-float {
          0%,
          100% {
            transform: translateY(0) rotate(-2deg);
          }
          50% {
            transform: translateY(-4px) rotate(2deg);
          }
        }

        @keyframes grass-sway {
          from {
            transform: rotate(-12deg);
          }
          to {
            transform: rotate(13deg);
          }
        }

        @keyframes firefly-float {
          from {
            transform: translateY(2px);
            opacity: 0.45;
          }
          to {
            transform: translateY(-5px);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ist-scene *,
          .ist-stars,
          .ist-moon,
          .ist-moon-position {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
