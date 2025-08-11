import type React from "react";
import { useMemo } from "react";
import { Avatar, Box, Chip, Divider, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useFormikContext } from "formik";
import { find } from "lodash";
import Home3EyesViewReportGraph from "pages/home/components/Home3EyesViewReport/Home3EyesViewReportGraph";
import HomeGroupDeltaChangeGraph from "pages/home/components/HomeGroupDeltaChange/HomeGroupDeltaChangeGraph";

import { ReportType } from "api/generated/models";
import { useUserControllerFilterUsers } from "api/generated/user/user";
import AscendIcon from "components/icons/AscendIcon";
import AscendTextIcon from "components/icons/AscendTextIcon";
import { userInitials } from "components/stores/MeStore";

/** ─────────────────────────────────────────────────────────────
 *  Helpers: sample matrices + recommendation rules
 *  (Replace these with your Google Sheet matrix lookups later)
 *  Group doc structure: Evaluation Assessments, Score Interpretation,
 *  3‑Eye View, AI Insights, Recommendations, ROI. (matches your spec)
 *  Individual doc structure: Overall Progress, Detailed Results,
 *  3‑Eye, AI Insights, Recommendations. (matches your spec)
 *  ─────────────────────────────────────────────────────────────
 */

// Interpret latest score -> meaning (auto-mapped)
// const interpretScoreMeaning = (latest: number) => {
//   if (latest >= 12) return "Strong, consistently applied across contexts";
//   if (latest >= 9) return "Developing—growing consistency across contexts";
//   return "Needs attention—application may be situational";
// };

// Delta -> trend label
// const trendFromDelta = (delta: number) => {
//   if (delta > 0.3) return "Improving";
//   if (delta < -0.3) return "Declining";
//   return "Stable";
// };

// Quick, action‑oriented suggestions (group-level)
const groupSuggestion = (latest: number, delta: number) => {
  if (latest >= 12) {
    return "🟢 High, sustain through peer mentoring & stretch roles";
  }
  if (delta < -0.5) {
    return "🔴 Decline detected—reinforce via scenarios & coaching";
  }

  return "🟡 Under development—use peer feedback & shadowing to deepen application";
};

// Quick, action‑oriented suggestions (individual)
const individualSuggestion = (latest: number, delta: number) => {
  if (latest >= 3.8) return "🟢 Sustain—consider mentoring others";
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
    {
      limit: -1,
      filter: "role::eq::Learner",
    },
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

  // GROUP PAGES
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
            <Box height={260}>{/* Placeholder for chart */}</Box>

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
                </b>{" "}
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
        <Box sx={{ transform: "rotate(90deg)", height: 515, pl: 2 }}>
          <Home3EyesViewReportGraph height={515} />
        </Box>
      </Page>,
    );

    // AI‑Generated Insights
    pages.push(
      <Page key="group-ai" width={width} height={height}>
        <SectionHeader title="AI‑Generated Insights" />
        <Typography fontSize={13} color="#646C60">
          • Most learners improved in decision‑making but show lower confidence
          under pressure.
          <br />• Strategic Thinking gains plateaued after the 2nd
          assessment—consider stretch assignments to maintain momentum.
        </Typography>
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

  // INDIVIDUAL PAGES
  if (isIndividual) {
    // Overall Progress
    pages.push(
      <Page key="ind-progress" width={width} height={height}>
        <SectionHeader
          title="Overall Progress Summary"
          subtitle="How your leadership capability evolved across assessments"
        />
        <HomeGroupDeltaChangeGraph height={280} />
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

    // Detailed Results
    pages.push(
      <Page key="ind-details" width={width} height={height}>
        <SectionHeader
          title="Detailed Results by Skill"
          subtitle="Green = Strength, Yellow = Growth, Red = Focus Area"
        />
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
        <Box sx={{ transform: "rotate(90deg)", height: 515, pl: 2 }}>
          <Home3EyesViewReportGraph height={515} />
        </Box>
      </Page>,
    );

    // AI Insights
    pages.push(
      <Page key="ind-ai" width={width} height={height}>
        <SectionHeader title="AI‑Generated Insights" />
        <Typography fontSize={13} color="#646C60">
          • Confidence in real‑world application accelerated after A2—capitalize
          with stretch reps.
          <br />• Strategic Thinking growth slowed post‑A2—plan a complexity
          jump to re‑ignite gains.
        </Typography>
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

  // Render with auto page numbers (1..N) including the cover
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
              {isIndividual && "Individual Report"}
              {isGroup && "Group Report"}
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
              <b>Range:</b> {values.rangeDate === "last-week" && "Last week"}
              {values.rangeDate === "last-month" && "Last month"}
            </Typography>
          )}
          <Typography fontSize={12} color="#646C60">
            Report generated {dayjs().format("DD MMM, YYYY")}
          </Typography>
        </Stack>
      </Page>

      {pages.map(
        (el, idx) =>
          // Clone to inject the dynamic footer without separate components

          ({
            ...el,
            key: el.key ?? idx,
            props: {
              ...el.props,
              footer: `Page ${idx + 1} of ${pages.length}`,
            },
          }) as any,
      )}
    </Stack>
  );
};

export default ReportPDF;
