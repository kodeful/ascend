import type React from "react";
import { useMemo } from "react";
import { Stack } from "@mui/material";
import { useFormikContext } from "formik";
import { find } from "lodash";

import { ReportType } from "api/generated/models";
import {
  useReportControllerGetGroupData,
  useReportControllerGetIndividualData,
} from "api/generated/report/report";
import { useUserControllerFilterUsers } from "api/generated/user/user";

import GroupAIInsights from "./GroupAIInsights";
import GroupEvaluationAssessments from "./GroupEvaluationAssessments";
import GroupRecommendations from "./GroupRecommendations";
import GroupROI from "./GroupROI";
import GroupThreeEye from "./GroupThreeEye";
import IndividualAIInsights from "./IndividualAIInsights";
import IndividualDetails from "./IndividualDetails";
import IndividualOverallProgress from "./IndividualOverallProgress";
import IndividualRecommendations from "./IndividualRecommendations";
import IndividualThreeEye from "./IndividualThreeEye";
import ReportCoverPage from "./ReportCoverPage";

// Charts intentionally omitted per request — leave TODO comments where needed
// import Home3EyesViewReportGraph from "pages/home/components/Home3EyesViewReport/Home3EyesViewReportGraph";
// import HomeGroupDeltaChangeGraph from "pages/home/components/HomeGroupDeltaChange/HomeGroupDeltaChangeGraph";

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

  const { data: groupData } = useReportControllerGetGroupData(
    {
      rangeData: values.rangeDate?.toString(),
    },
    {
      query: {
        queryKey: ["group-data", values.rangeDate?.toString()],
      },
    },
  ) as unknown as any;

  const { data: individualData } = useReportControllerGetIndividualData(
    {
      rangeData: values.rangeDate?.toString(),
      learner: values.learner,
    },
    {
      query: {
        queryKey: ["individual-data", values.rangeDate?.toString()],
      },
    },
  ) as unknown as any;

  // Build pages (single place), then auto-number them
  const pages: React.ReactElement[] = [];

  /** COVER (kept same position) **/
  pages.push(
    <ReportCoverPage
      key="cover"
      width={width}
      height={height}
      values={values}
      learner={learner}
      isGroup={isGroup}
      isIndividual={isIndividual}
      assessmentsIncluded={groupData?.assessmentsIncluded ?? 0}
    />,
  );

  /** GROUP PAGES **/
  if (isGroup && values.rangeDate) {
    pages.push(
      <GroupEvaluationAssessments
        key="group-eval"
        width={width}
        height={height}
        skills={groupData?.skills ?? []}
        horizontal={values.horizontal}
      />,
    );
    pages.push(
      <GroupThreeEye
        key="group-3eye"
        width={width}
        height={height}
        threeEye={groupData?.threeEye ?? { self: 0, peer: 0, facilitator: 0 }}
      />,
    );
    pages.push(
      <GroupAIInsights
        key="group-ai"
        width={width}
        height={height}
        // insights={computeInsightsGroup(groupData.skills)}
        insights={groupData?.insights ?? []}
      />,
    );
    pages.push(
      <GroupRecommendations
        key="group-recs"
        width={width}
        height={height}
        skills={groupData?.skills ?? []}
      />,
    );
    pages.push(
      <GroupROI
        key="group-roi"
        width={width}
        height={height}
        skills={groupData?.skills ?? []}
      />,
    );
  }

  /** INDIVIDUAL PAGES **/
  if (isIndividual && values.learner && values.rangeDate) {
    pages.push(
      <IndividualOverallProgress
        key="individual-progress"
        width={width}
        height={height}
        timeline={individualData?.globalTimeline ?? []}
      />,
    );
    pages.push(
      <IndividualDetails
        key="individual-details"
        width={width}
        height={height}
        skills={individualData?.skills ?? []}
        horizontal={values.horizontal}
      />,
    );
    pages.push(
      <IndividualThreeEye
        key="individual-3eye"
        width={width}
        height={height}
        threeEye={
          individualData?.threeEye ?? { self: 0, peer: 0, facilitator: 0 }
        }
      />,
    );
    pages.push(
      <IndividualAIInsights
        key="individual-ai"
        width={width}
        height={height}
        // lines={computeInsightsIndividual(individualData.globalTimeline)}
        lines={individualData?.insights ?? []}
      />,
    );
    pages.push(
      <IndividualRecommendations
        key="individual-recommendations"
        width={width}
        height={height}
        skills={individualData?.skills ?? []}
      />,
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
      {pages.map(
        (el, idx) =>
          ({
            ...el,
            key: el.key ?? idx,
            props: {
              ...el.props,
              pt: el.props?.pt ?? (idx === 0 ? 10 : 1), // keep your cover padding
              footer:
                idx === 0 ? undefined : `Page ${idx} of ${pages.length - 1}`,
            },
          }) as any,
      )}
    </Stack>
  );
};

export default ReportPDF;
