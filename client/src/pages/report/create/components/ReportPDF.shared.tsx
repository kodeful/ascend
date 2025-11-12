import { Box, Stack, Typography } from "@mui/material";
import _ from "lodash";

import AscendIcon from "components/icons/AscendIcon";

/** ─────────────────────────────────────────────────────────────
 *  Helpers: bands + recommendation rules (matrix-ready)
 *  Replace hardcoded bands with Google Sheet lookups when wired.
 *  ─────────────────────────────────────────────────────────────
 */

// Bands can be externalized to your matrix
export const GROUP_BANDS = {
  strongMin: 12, // 12–15 strong
  moderateMin: 9, // 9–11 moderate
  declineDelta: -0.5, // customize per spec (e.g., declined 5–8 pts if on 0–15)
};

export const INDIVIDUAL_BANDS = {
  sustainMin: 3.8, // 0–5 scale example
};

// Interpret latest score -> meaning (auto-mapped) — placeholder for matrix lookup
export const interpretScoreMeaning = (latest: number) => {
  if (latest >= GROUP_BANDS.strongMin)
    return "Strong, consistently applied across contexts";
  if (latest >= GROUP_BANDS.moderateMin)
    return "Developing—growing consistency across contexts";
  return "Needs attention—application may be situational";
};

// Delta -> trend label
export const trendFromDelta = (delta: number) => {
  if (delta > 0.3) return "Improving";
  if (delta < -0.3) return "Declining";
  return "Stable";
};

// Quick, action-oriented suggestions (group-level)
export const groupSuggestion = (latest: number, delta: number) => {
  if (latest >= GROUP_BANDS.strongMin) {
    return "🟢 High, sustain through peer mentoring & stretch roles";
  }
  if (delta <= GROUP_BANDS.declineDelta) {
    return "🔴 Decline detected—reinforce via scenarios & coaching";
  }
  return "🟡 Under development—use peer feedback & shadowing to deepen application";
};

// Quick, action-oriented suggestions (individual)
export const individualSuggestion = (latest: number, delta: number) => {
  if (latest >= INDIVIDUAL_BANDS.sustainMin)
    return "🟢 Sustain—consider mentoring others";
  if (delta < 0) return "🔴 Reinforce—scenario practice & coached reps";
  return "🟡 Keep building—prompted reflection & peer feedback";
};

// Utility (using lodash where possible)
export const mean = (arr: number[]) => _.mean(arr) ?? 0;
export const round1 = (n: number) => _.round(n, 1);
export const pct = (n: number) => `${Math.round(n)}%`;

/** ─────────────────────────────────────────────────────────────
 *  Sample Data (replace with real API data later)
 *  ─────────────────────────────────────────────────────────────
 */

// Skills use a 0–15 scale in this sample, adjust to your real ranges.
export const SKILLS = [
  "Self-Awareness",
  "Critical Thinking",
  "Strategic Thinking",
  "Communication",
  "Decision-Making",
  "Adaptability",
];

/** ─────────────────────────────────────────────────────────────
 *  Shared UI bits
 *  ─────────────────────────────────────────────────────────────
 */

export const Page: React.FC<{
  width: number;
  height: number;
  children: React.ReactNode;
  px?: number;
  pt?: number;
  pb?: number;
  footer?: string;
}> = ({ width, height, children, px = 9, pt = 6, pb = 6, footer }) => (
  <Stack
    position="relative"
    width={width}
    height={height}
    borderRadius={1.5}
    bgcolor="#FFF"
    boxShadow="4px 4px 11.3px 0px #0000000D"
    pt={pt}
    pb={pb}
    px={px}
    overflow="hidden"
    boxSizing="border-box"
    spacing={3}
  >
    <AscendIcon
      sx={{
        position: "absolute",
        bottom: -15,
        right: -20,
        width: 210,
        height: 249,
        opacity: 0.06,
      }}
    />
    {children}

    {footer && (
      <Box
        sx={{
          position: "absolute",
          bottom: 15,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Typography fontSize={12} color="#646C60">
          {footer}
        </Typography>
      </Box>
    )}
  </Stack>
);

export const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <Stack spacing={0.5}>
    <Typography fontSize={20} fontWeight={700} color="primary.dark">
      {title}
    </Typography>
    {subtitle && (
      <Typography fontSize={13} color="#646C60">
        {subtitle}
      </Typography>
    )}
    <Box width={42} sx={{ bgcolor: "primary.main", height: "2px", mt: 1 }} />
  </Stack>
);

// Tiny insight helpers (no charts)
export const computeInsightsGroup = (skills: any) => {
  // TODO: Replace with real logic + matrix-driven text
  const mostImproved = [...skills].sort((a, b) => b.delta - a.delta)[0]?.skill;
  return [
    mostImproved
      ? `Strongest improvement observed in ${mostImproved}.`
      : undefined,
    "Confidence appears to rise alongside application across most skills.",
  ].filter(Boolean) as string[];
};

export const computeInsightsIndividual = (timeline: any) => {
  // TODO: Replace with plateau/surge detection
  if (timeline.length < 3)
    return ["Additional assessments will clarify trend."];
  const a1 = timeline[0].global;
  const a2 = timeline[1].global;
  const a3 = timeline[timeline.length - 1].global;
  const plateau = a2 - a1 > 0 && a3 - a2 < 0.2;
  const insights: string[] = [];
  if (plateau)
    insights.push(
      "Growth plateaued after the second assessment—consider complexity increase.",
    );
  if (a3 - a1 > 2) insights.push("Substantial overall gains across the cycle.");
  return insights.length ? insights : ["Steady growth across assessments."];
};
