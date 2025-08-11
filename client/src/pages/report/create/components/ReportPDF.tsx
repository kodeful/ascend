import type React from "react";
import { useMemo } from "react";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useFormikContext } from "formik";
import { find } from "lodash";

// Charts intentionally omitted per request — leave TODO comments where needed
// import Home3EyesViewReportGraph from "pages/home/components/Home3EyesViewReport/Home3EyesViewReportGraph";
// import HomeGroupDeltaChangeGraph from "pages/home/components/HomeGroupDeltaChange/HomeGroupDeltaChangeGraph";

import { ReportType } from "api/generated/models";
import { useUserControllerFilterUsers } from "api/generated/user/user";
import AscendIcon from "components/icons/AscendIcon";
import AscendTextIcon from "components/icons/AscendTextIcon";
import { useMeStore, userInitials } from "components/stores/MeStore";

/** ─────────────────────────────────────────────────────────────
 *  Helpers: bands + recommendation rules (matrix-ready)
 *  Replace hardcoded bands with Google Sheet lookups when wired.
 *  ─────────────────────────────────────────────────────────────
 */

// Bands can be externalized to your matrix
const GROUP_BANDS = {
  strongMin: 12, // 12–15 strong
  moderateMin: 9, // 9–11 moderate
  declineDelta: -0.5, // customize per spec (e.g., declined 5–8 pts if on 0–15)
};

const INDIVIDUAL_BANDS = {
  sustainMin: 3.8, // 0–5 scale example
};

// Interpret latest score -> meaning (auto-mapped) — placeholder for matrix lookup
const interpretScoreMeaning = (latest: number) => {
  if (latest >= GROUP_BANDS.strongMin)
    return "Strong, consistently applied across contexts";
  if (latest >= GROUP_BANDS.moderateMin)
    return "Developing—growing consistency across contexts";
  return "Needs attention—application may be situational";
};

// Delta -> trend label
const trendFromDelta = (delta: number) => {
  if (delta > 0.3) return "Improving";
  if (delta < -0.3) return "Declining";
  return "Stable";
};

// Quick, action‑oriented suggestions (group-level)
const groupSuggestion = (latest: number, delta: number) => {
  if (latest >= GROUP_BANDS.strongMin) {
    return "🟢 High, sustain through peer mentoring & stretch roles";
  }
  if (delta <= GROUP_BANDS.declineDelta) {
    return "🔴 Decline detected—reinforce via scenarios & coaching";
  }
  return "🟡 Under development—use peer feedback & shadowing to deepen application";
};

// Quick, action‑oriented suggestions (individual)
const individualSuggestion = (latest: number, delta: number) => {
  if (latest >= INDIVIDUAL_BANDS.sustainMin)
    return "🟢 Sustain—consider mentoring others";
  if (delta < 0) return "🔴 Reinforce—scenario practice & coached reps";
  return "🟡 Keep building—prompted reflection & peer feedback";
};

// Utility
const mean = (arr: number[]) =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
const round1 = (n: number) => Math.round(n * 10) / 10;
const pct = (n: number) => `${Math.round(n)}%`;

/** ─────────────────────────────────────────────────────────────
 *  Sample Data (replace with real API data later)
 *  ─────────────────────────────────────────────────────────────
 */

// Skills use a 0–15 scale in this sample, adjust to your real ranges.
const SKILLS = [
  "Self-Awareness",
  "Critical Thinking",
  "Strategic Thinking",
  "Communication",
  "Decision-Making",
  "Adaptability",
];

const SAMPLE_GROUP = {
  cohortName: "Emerging Leaders – Spring",
  company: "Acme Corp",
  periodFrom: "2025-02-01",
  periodTo: "2025-07-25",
  assessmentsIncluded: 3,
  // per skill: avg before / latest across cohort + % improved
  skills: SKILLS.map((s, i) => {
    const before = 7 + (i % 3); // 7..9
    const latest = before + (i % 2 === 0 ? 2.1 : 0.6); // some improve strongly, some lightly
    const delta = latest - before;
    const improvedShare = i % 2 === 0 ? 0.78 : 0.56;
    return { skill: s, before, latest, delta, improvedShare };
  }),
  // 3‑Eye global (all skills combined)
  threeEye: { self: 11.1, peer: 10.6, facilitator: 10.9 },
};

const SAMPLE_INDIVIDUAL = {
  learnerName: "Jordan Avery",
  company: "Acme Corp",
  dates: ["2025-02-01", "2025-04-15", "2025-07-25"],
  // Global combined line (0–15)
  globalTimeline: [
    { label: "A1", date: "2025-02-01", global: 8.7, confidence: 8.1 },
    { label: "A2", date: "2025-04-15", global: 10.2, confidence: 9.3 },
    { label: "A3", date: "2025-07-25", global: 11.4, confidence: 10.6 },
  ],
  // Table: Knowledge / Application / Confidence (0–5 each in this sample)
  // (You can re‑scale if you use 1–5 or 1–3 per dimension.)
  skills: SKILLS.map((s, i) => {
    const kb = 2.9 + (i % 3) * 0.3; // before knowledge
    const ka = kb + (i % 2 === 0 ? 0.9 : 0.4); // after knowledge
    const ab = 2.7 + ((i + 1) % 3) * 0.3; // before application
    const aa = ab + (i % 2 === 0 ? 0.9 : 0.3);
    const cb = 2.6 + ((i + 2) % 3) * 0.3; // before confidence
    const ca = cb + (i % 2 === 0 ? 1.2 : 0.5);
    return {
      skill: s,
      aspects: {
        Knowledge: { begin: round1(kb), end: round1(ka) },
        Application: { begin: round1(ab), end: round1(aa) },
        Confidence: { begin: round1(cb), end: round1(ca) },
      },
    };
  }),
  threeEye: { self: 11.5, peer: 10.8, facilitator: 11.1 },
};

/** ─────────────────────────────────────────────────────────────
 *  Shared UI bits
 *  ─────────────────────────────────────────────────────────────
 */

const Page: React.FC<{
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

const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({
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

/** ─────────────────────────────────────────────────────────────
 *  Tiny insight helpers (no charts)
 *  ─────────────────────────────────────────────────────────────
 */

const computeInsightsGroup = (skills: typeof SAMPLE_GROUP.skills) => {
  // TODO: Replace with real logic + matrix-driven text
  const mostImproved = [...skills].sort((a, b) => b.delta - a.delta)[0]?.skill;
  return [
    mostImproved
      ? `Strongest improvement observed in ${mostImproved}.`
      : undefined,
    "Confidence appears to rise alongside application across most skills.",
  ].filter(Boolean) as string[];
};

const computeInsightsIndividual = (
  timeline: typeof SAMPLE_INDIVIDUAL.globalTimeline,
) => {
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

/** ─────────────────────────────────────────────────────────────
 *  MAIN (single component + dynamic page numbering)
 *  ─────────────────────────────────────────────────────────────
 */

const ReportPDF: React.FC = () => {
  const { values } = useFormikContext() as any;

  const { width, height } = useMemo(() => {
    if (values.horizontal) {
      return { width: 934, height: 660 };
    }

    return { width: 660, height: 934 };
  }, [values.horizontal]);

  const { data: learners } = useUserControllerFilterUsers(
    { limit: -1, filter: "role::eq::Learner" },
    {
      query: {
        queryKey: ["users", "learner"],
        enabled:
          values.reportType === "individual-report" ||
          values.reportType === ReportType.Individual_Report,
      },
    },
  );

  const learner = useMemo(
    () => find(learners?.data, { _id: values.learner }),
    [learners, values.learner],
  );

  const isGroup =
    values.reportType === "group-report" ||
    values.reportType === ReportType.Group_Report;
  const isIndividual =
    values.reportType === "individual-report" ||
    values.reportType === ReportType.Individual_Report;

  // Data to feed pages (swap to real data later)
  const groupData = SAMPLE_GROUP;
  const individualData = {
    ...SAMPLE_INDIVIDUAL,
    learnerName: learner?.fullName || SAMPLE_INDIVIDUAL.learnerName,
  };

  // Build pages (single place), then auto-number them
  const pages: React.ReactElement[] = [];

  /** GROUP PAGES **/
  if (isGroup) {
    // Evaluation Assessments
    pages.push(
      <Page key="group-eval" width={width} height={height}>
        <SectionHeader
          title="Evaluation Assessments"
          subtitle="Where change is happening across the cohort"
        />
        <Stack direction="row" spacing={4} sx={{ height: "100%" }}>
          <Box flex={1}>
            <Typography fontSize={13} color="#646C60" mb={1}>
              Average score by skill (latest across all completed assessments)
            </Typography>
            {/* TODO: insert bar chart for average scores by skill */}
            <Box height={260} />

            <Typography fontSize={13} color="#646C60" mt={2}>
              % of individuals who improved per skill
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.2} mt={1.2}>
              {groupData.skills.map((s) => (
                <Chip
                  key={s.skill}
                  label={`${s.skill}: ${pct(s.improvedShare * 100)}`}
                  size="small"
                  sx={{ bgcolor: "rgba(0,0,0,0.04)" }}
                />
              ))}
            </Stack>
          </Box>

          <Divider orientation="vertical" flexItem />

          <Box flex={1.1}>
            <Typography fontSize={13} color="#646C60" mb={1}>
              Score Interpretation + Meaning (auto‑mapped)
            </Typography>

            {/* Non-table interpretation list */}
            <Stack spacing={1.2}>
              {groupData.skills.slice(0, values.horizontal ? 4 : 6).map((s) => (
                <Stack
                  key={s.skill}
                  spacing={0.2}
                  sx={{ p: 1, borderRadius: 1, bgcolor: "rgba(0,0,0,0.02)" }}
                >
                  <Typography
                    fontSize={13}
                    fontWeight={600}
                    color="primary.dark"
                  >
                    {s.skill}
                  </Typography>
                  <Typography fontSize={12} color="#646C60">
                    Latest: <b>{round1(s.latest)}</b> (
                    {s.delta >= 0 ? "↑" : "↓"}
                    {round1(Math.abs(s.delta))}) • Trend:{" "}
                    {trendFromDelta(s.delta)}
                  </Typography>
                  <Typography fontSize={12} color="#646C60">
                    Meaning: {interpretScoreMeaning(s.latest)}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Box mt={2}>
              <Typography fontSize={13} color="#646C60" fontWeight={600}>
                Group Transformation Score
              </Typography>
              <Typography fontSize={13} color="#646C60">
                Avg Global Score Delta (After – Before):{" "}
                <b>
                  {round1(
                    mean(groupData.skills.map((s) => s.latest - s.before)),
                  )}
                </b>
                &nbsp;•&nbsp;
                <i>
                  {(() => {
                    const val = mean(
                      groupData.skills.map((s) => s.latest - s.before),
                    );
                    if (val >= 2) return "High transformation";
                    if (val >= 1) return "Moderate transformation";
                    return "Early signs of change";
                  })()}
                </i>
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Page>,
    );

    // 3‑Eye View
    pages.push(
      <Page key="group-3eye" width={width} height={height}>
        <SectionHeader title="3‑Eye View: Self, Peer & Facilitator" />
        <Typography fontSize={13} color="#646C60" mb={1}>
          Aggregated global perspective (all skills combined)
        </Typography>
        {/* TODO: insert 3‑eye chart (group global) */}
        <Box sx={{ height: 515, pl: 2 }} />
        <Typography fontSize={12} color="#646C60" mt={1}>
          Interpretation: {/* TODO: map 3‑eye alignment to matrix narrative */}
        </Typography>
      </Page>,
    );

    // AI‑Generated Insights
    pages.push(
      <Page key="group-ai" width={width} height={height}>
        <SectionHeader title="AI‑Generated Insights" />
        <Stack spacing={0.6}>
          {computeInsightsGroup(groupData.skills).map((line, i) => (
            <Typography key={i} fontSize={13} color="#646C60">
              • {line}
            </Typography>
          ))}
          {/* TODO: compute insights directly from cohort deltas and time windows */}
        </Stack>
      </Page>,
    );

    // Recommendations
    pages.push(
      <Page key="group-recs" width={width} height={height}>
        <SectionHeader title="Suggested Focus Areas / Recommendations" />
        <Stack direction="row" flexWrap="wrap" gap={1.2}>
          {groupData.skills.map((s) => (
            <Chip
              key={s.skill}
              label={`${s.skill}: ${groupSuggestion(s.latest, s.delta)}`}
            />
          ))}
        </Stack>
      </Page>,
    );

    // ROI
    pages.push(
      <Page key="group-roi" width={width} height={height}>
        <SectionHeader title="ROI: Return on Leadership Development" />
        <Typography fontSize={13} color="#646C60">
          Measured using pre/post deltas at the group level to quantify
          transformation.{" "}
          <b>
            {(() => {
              const avgDelta = mean(groupData.skills.map((s) => s.delta));
              if (avgDelta >= 2)
                return "Strong measurable behavior change—high program ROI";
              if (avgDelta >= 1)
                return "Meaningful gains—solid ROI with room to scale";
              return "Emerging value—reinforce to unlock ROI";
            })()}
          </b>
          . Track leading indicators (manager check‑ins, project scope
          increases) to connect behavioral change with business value.
        </Typography>
      </Page>,
    );
  }

  /** INDIVIDUAL PAGES **/
  if (isIndividual) {
    // Overall Progress
    pages.push(
      <Page key="ind-progress" width={width} height={height}>
        <SectionHeader
          title="Overall Progress Summary"
          subtitle="How your leadership capability evolved across assessments"
        />
        {/* TODO: insert global results line chart */}
        <Box height={280} />
        {(() => {
          const latest =
            individualData.globalTimeline[
              individualData.globalTimeline.length - 1
            ];
          const first = individualData.globalTimeline[0];
          const delta = latest.global - first.global;
          const pctImprovement = Math.max(
            0,
            (delta / Math.max(1e-9, first.global)) * 100,
          );
          return (
            <Typography fontSize={13} color="#646C60" mt={1}>
              Results indicate steady growth with notable confidence gains.
              Latest global score: <b>{round1(latest.global)}</b> (Δ{" "}
              {delta >= 0 ? "↑" : "↓"}
              {round1(Math.abs(delta))}). Approx.{" "}
              <b>{Math.round(pctImprovement)}%</b> improvement since first
              assessment.
            </Typography>
          );
        })()}
      </Page>,
    );

    // Detailed Results (non-table mini-cards)
    pages.push(
      <Page key="ind-details" width={width} height={height}>
        <SectionHeader
          title="Detailed Results by Skill"
          subtitle="Green = Strength, Yellow = Growth, Red = Focus Area"
        />
        <Stack spacing={1.2} mt={1}>
          {individualData.skills
            .slice(0, values.horizontal ? 4 : 6)
            .map((s) => {
              const k = s.aspects.Knowledge;
              const a = s.aspects.Application;
              const c = s.aspects.Confidence;
              const latestAvg = mean([k.end, a.end, c.end]);
              const beginAvg = mean([k.begin, a.begin, c.begin]);
              const delta = latestAvg - beginAvg;
              const suggestion = individualSuggestion(latestAvg, delta);
              const tone = suggestion.startsWith("🟢")
                ? "#E6F4EA"
                : suggestion.startsWith("🔴")
                  ? "#FDECEA"
                  : "#FFF8E1";

              return (
                <Stack
                  key={s.skill}
                  spacing={0}
                  sx={{
                    p: 1.2,
                    borderRadius: 1,
                    bgcolor: tone,
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Typography
                      fontSize={13}
                      fontWeight={700}
                      color="primary.dark"
                    >
                      {s.skill}
                    </Typography>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Chip label={suggestion} size="small" />
                    </Stack>
                  </Stack>
                  <Grid container spacing={1} mt={0.5}>
                    <Grid item xs={6}>
                      <Typography fontSize={12} color="#646C60">
                        Knowledge — {k.begin} → <b>{k.end}</b> (Δ{" "}
                        {round1(k.end - k.begin)})
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography fontSize={12} color="#646C60">
                        Application — {a.begin} → <b>{a.end}</b> (Δ{" "}
                        {round1(a.end - a.begin)})
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography fontSize={12} color="#646C60">
                        Confidence — {c.begin} → <b>{c.end}</b> (Δ{" "}
                        {round1(c.end - c.begin)})
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography fontSize={12} color="#646C60">
                        Avg Δ: {round1(delta)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Stack>
              );
            })}
        </Stack>

        <Box mt={2}>
          <Typography fontSize={13} color="#646C60" fontWeight={600}>
            Transformation Score
          </Typography>
          {(() => {
            const firstGlobal = individualData.globalTimeline[0].global;
            const lastGlobal =
              individualData.globalTimeline[
                individualData.globalTimeline.length - 1
              ].global;
            const transformationScore =
              (lastGlobal - firstGlobal) / Math.max(1e-9, lastGlobal);
            return (
              <Typography fontSize={13} color="#646C60">
                (After – Before) / After ={" "}
                <b>{round1(transformationScore * 100)}%</b> overall improvement
                indicator.
              </Typography>
            );
          })()}
        </Box>
      </Page>,
    );

    // 3‑Eye Report
    pages.push(
      <Page key="ind-3eye" width={width} height={height}>
        <SectionHeader
          title="3‑Eye Report"
          subtitle="Global alignment across Self, Peer & Facilitator"
        />
        {/* TODO: insert 3‑eye chart (individual global) */}
        <Box sx={{ height: 515, pl: 2 }} />
        <Typography fontSize={12} color="#646C60" mt={1}>
          Interpretation: {/* TODO: derive narrative from 3‑eye differences */}
        </Typography>
      </Page>,
    );

    // AI Insights
    pages.push(
      <Page key="ind-ai" width={width} height={height}>
        <SectionHeader title="AI‑Generated Insights" />
        <Stack spacing={0.6}>
          {computeInsightsIndividual(individualData.globalTimeline).map(
            (line, i) => (
              <Typography key={i} fontSize={13} color="#646C60">
                • {line}
              </Typography>
            ),
          )}
          {/* TODO: compute insights directly from individual deltas and confidence timeline */}
        </Stack>
      </Page>,
    );

    // Recommendations
    pages.push(
      <Page key="ind-recs" width={width} height={height}>
        <SectionHeader title="Suggested Focus Areas / Next Steps" />
        <Stack direction="row" flexWrap="wrap" gap={1.2}>
          {individualData.skills.map((s) => {
            const k = s.aspects.Knowledge;
            const a = s.aspects.Application;
            const c = s.aspects.Confidence;
            const latestAvg = mean([k.end, a.end, c.end]);
            const beginAvg = mean([k.begin, a.begin, c.begin]);
            const delta = latestAvg - beginAvg;
            return (
              <Chip
                key={s.skill}
                label={`${s.skill}: ${individualSuggestion(latestAvg, delta)}`}
              />
            );
          })}
        </Stack>
      </Page>,
    );
  }

  // Render with auto page numbers (1..N) for content pages. Cover remains without footer.
  return (
    <Stack
      mt={3}
      direction="column"
      width="100%"
      alignItems="center"
      spacing={3}
    >
      {/* COVER */}
      <Page key="cover" width={width} height={height} pt={10} pb={8} px={9}>
        {/* HEADER */}
        <Stack
          direction="row"
          spacing={1.5}
          width="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Stack
            width={35}
            height={35}
            border="1px solid #E1E1E1"
            justifyContent="center"
            alignItems="center"
            borderRadius="10px"
          >
            <AscendIcon />
          </Stack>
          <AscendTextIcon sx={{ width: 98 }} />
        </Stack>

        {/* TITLE */}
        <Stack
          textAlign="center"
          alignItems="center"
          flex={1}
          justifyContent="center"
        >
          {values.title && (
            <Typography fontSize={42} fontWeight={600} color="primary.dark">
              {values.title}
            </Typography>
          )}
          {values.reportType && (
            <Typography fontSize={42} fontWeight={600} color="primary.dark">
              {(values.reportType === "individual-report" ||
                values.reportType === ReportType.Individual_Report) &&
                "Individual Report"}
              {(values.reportType === "group-report" ||
                values.reportType === ReportType.Group_Report) &&
                "Group Report"}
            </Typography>
          )}
          <Box
            width={42}
            sx={{ bgcolor: "primary.main", height: "1px", my: 2 }}
          />
          {values.subtitle && (
            <Typography fontSize={28} fontWeight={600} color="#646C60">
              {values.subtitle}
            </Typography>
          )}

          {/* Snapshot block (spec) */}
          <Stack spacing={0.5} mt={2}>
            <Typography fontSize={13} color="#646C60">
              <b>Company:</b> {useMeStore.getState().organisation?.name}
            </Typography>

            {isGroup && (
              <Typography fontSize={13} color="#646C60">
                <b>Assessments included:</b> {SAMPLE_GROUP.assessmentsIncluded}
              </Typography>
            )}
          </Stack>

          {/* Learner pill for individual */}
          {values.learner && isIndividual && (
            <Stack direction="row" alignItems="center" spacing={1} mt={2}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: "#EC762E",
                  color: "#FFF",
                  fontSize: 11,
                  lineHeight: 1.2,
                  fontWeight: 600,
                }}
              >
                {userInitials(learner?.fullName)}
              </Avatar>
              <Typography fontSize={14} fontWeight={600} color="#646C60">
                {learner?.fullName}
              </Typography>
            </Stack>
          )}
        </Stack>

        {/* FOOTER */}
        <Stack textAlign="center" alignItems="center">
          {values.rangeDate && (
            <Typography fontSize={14} color="#646C60">
              <b>Period:</b> {values.rangeDate}
            </Typography>
          )}
          <Typography fontSize={12} color="#646C60">
            Report generated {dayjs().format("DD MMM, YYYY")}
          </Typography>
        </Stack>
      </Page>

      {/* CONTENT PAGES WITH DYNAMIC FOOTERS */}
      {pages.map(
        (el, idx) =>
          ({
            ...el,
            key: el.key ?? idx,
            props: {
              ...el.props,
              pt: 1,
              footer: `Page ${idx + 1} of ${pages.length}`,
            },
          }) as any,
      )}
    </Stack>
  );
};

export default ReportPDF;
