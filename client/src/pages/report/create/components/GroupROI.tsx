import type React from "react";
import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";

import { mean, Page, SectionHeader } from "./ReportPDF.shared";

type Props = {
  width: number;
  height: number;
  skills: { before: number; latest: number; delta: number }[];
};

const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, n));

const GroupROI: React.FC<Props> = ({ width, height, skills }) => {
  const theme = useTheme();

  // Fallback sample if empty (keeps PDF from looking blank during wiring)
  const rows = skills?.length
    ? skills
    : [
        { before: 7.5, latest: 9.2, delta: 1.7 },
        { before: 8.1, latest: 9.5, delta: 1.4 },
        { before: 7.8, latest: 10.2, delta: 2.4 },
        { before: 9.0, latest: 10.8, delta: 1.8 },
        { before: 8.4, latest: 10.6, delta: 2.2 },
        { before: 7.2, latest: 8.0, delta: 0.8 },
      ];

  // Core aggregates
  const avgBefore = mean(rows.map((r) => r.before));
  //   const avgLatest = mean(rows.map((r) => r.latest));
  const avgDelta = mean(rows.map((r) => r.delta));
  const medianDelta = (() => {
    const arr = rows
      .map((r) => r.delta)
      .slice()
      .sort((a, b) => a - b);
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
  })();

  const improvedCount = rows.filter((r) => r.delta > 0).length;
  const strongCount = rows.filter((r) => r.delta >= 2).length;

  const improvedPct = rows.length ? (improvedCount / rows.length) * 100 : 0;
  const strongPct = rows.length ? (strongCount / rows.length) * 100 : 0;

  // Overall improvement relative to baseline avg
  const overallPct = avgBefore > 0 ? (avgDelta / avgBefore) * 100 : 0;

  // Distribution buckets for quick read
  const buckets = [
    { label: "Δ ≥ 2.0", min: 2, max: Infinity, color: "#EE4F28" },
    { label: "Δ 1.0–1.9", min: 1, max: 2, color: "#F1B136" },
    { label: "Δ 0–0.9", min: 0, max: 1, color: "#AEAC95" },
    { label: "Decline", min: -Infinity, max: 0, color: "#9E9E9E" },
  ].map((b) => ({
    ...b,
    count: rows.filter((r) => r.delta >= b.min && r.delta < b.max).length,
  }));
  const maxBucket = Math.max(1, ...buckets.map((b) => b.count));

  return (
    <Page key="group-roi" width={width} height={height}>
      <SectionHeader title="ROI: Return on Leadership Development" />

      {/* KPI row */}
      <Grid container spacing={1.5}>
        <Grid item xs={3}>
          <KPI
            title="Avg Δ (After–Before)"
            value={format1(avgDelta)}
            accent="#EC762E"
          />
        </Grid>
        <Grid item xs={3}>
          <KPI title="Median Δ" value={format1(medianDelta)} accent="#F1B136" />
        </Grid>
        <Grid item xs={3}>
          <KPI
            title="% Improved"
            value={`${Math.round(improvedPct)}%`}
            accent="#AEAC95"
          />
        </Grid>
        <Grid item xs={3}>
          <KPI
            title="Strong Gains (Δ≥2)"
            value={`${Math.round(strongPct)}%`}
            accent="#EE4F28"
          />
        </Grid>
      </Grid>

      {/* Overall improvement bar */}
      <Stack mt={2}>
        <Typography fontSize={13} color="#646C60" mb={0.5} fontWeight={600}>
          Overall Improvement vs. Baseline
        </Typography>
        <BarTrack
          percent={clamp(overallPct, -100, 300)}
          color={overallPct >= 0 ? theme.palette.primary.main : "#9E9E9E"}
          labelLeft={`Avg Before: ${format1(avgBefore)}`}
          labelRight={`${Math.round(overallPct)}%`}
        />
      </Stack>

      {/* Distribution mini bars */}
      <Stack mt={2}>
        <Typography fontSize={13} color="#646C60" mb={0.5} fontWeight={600}>
          Distribution of Skill Deltas
        </Typography>
        <Grid container spacing={1}>
          {buckets.map((b) => {
            const widthPct = (b.count / maxBucket) * 100;
            return (
              <Grid key={b.label} item xs={6} md={3}>
                <Stack spacing={0.5}>
                  <Typography fontSize={12} color="#646C60">
                    {b.label} — <b>{b.count}</b>
                  </Typography>
                  <Box
                    sx={{
                      height: 10,
                      borderRadius: 10,
                      bgcolor: "rgba(0,0,0,0.06)",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${widthPct}%`,
                        bgcolor: b.color,
                        transition: "width 300ms ease",
                      }}
                    />
                  </Box>
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      </Stack>

      {/* Narrative */}
      <Stack mt={2} spacing={0.5}>
        <Typography fontSize={13} color="#1F2A1E" fontWeight={700}>
          {(() => {
            if (avgDelta >= 2)
              return "Strong measurable behavior change—high program ROI";
            if (avgDelta >= 1)
              return "Meaningful gains—solid ROI with room to scale";
            return "Emerging value—reinforce to unlock ROI";
          })()}
        </Typography>

        <Typography fontSize={13} color="#646C60">
          Measured using pre/post deltas at the group level to quantify
          transformation. Track leading indicators (manager check-ins, project
          scope increases) to connect behavioral change with business value.
        </Typography>
      </Stack>
    </Page>
  );
};

export default GroupROI;

/* ───────────────────────── helpers (local) ───────────────────────── */

function format1(n: number) {
  return (Math.round(n * 10) / 10).toFixed(1);
}

const KPI: React.FC<{ title: string; value: string; accent: string }> = ({
  title,
  value,
  accent,
}) => (
  <Stack
    spacing={0.5}
    sx={{
      p: 1.2,
      borderRadius: 1,
      border: "1px solid rgba(0,0,0,0.06)",
      bgcolor: "#FAFAFA",
    }}
  >
    <Typography fontSize={12} color="#646C60">
      {title}
    </Typography>
    <Stack direction="row" alignItems="baseline" spacing={1}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: accent,
        }}
      />
      <Typography fontSize={20} fontWeight={700} color="primary.dark">
        {value}
      </Typography>
    </Stack>
  </Stack>
);

const BarTrack: React.FC<{
  percent: number; // -100..300 safe
  color: string;
  labelLeft?: string;
  labelRight?: string;
}> = ({ percent, color, labelLeft, labelRight }) => (
  <Stack spacing={0.5}>
    {(labelLeft || labelRight) && (
      <Stack direction="row" justifyContent="space-between">
        <Typography fontSize={12} color="#646C60">
          {labelLeft}
        </Typography>
        <Typography fontSize={12} color="#646C60" fontWeight={600}>
          {labelRight}
        </Typography>
      </Stack>
    )}
    <Box
      sx={{
        height: 12,
        borderRadius: 12,
        bgcolor: "rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          height: "100%",
          width: `${clamp(percent)}%`,
          bgcolor: color,
          transition: "width 300ms ease",
        }}
      />
    </Box>
  </Stack>
);
