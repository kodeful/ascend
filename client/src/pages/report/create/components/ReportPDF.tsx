import type React from "react";
import { useMemo } from "react";
import { Stack } from "@mui/material";
import { useFormikContext } from "formik";
import { find } from "lodash";

import { ReportType } from "api/generated/models";
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

import {
  computeInsightsGroup,
  computeInsightsIndividual,
  // Page, // re-exported but only used by CoverPage internally
  SAMPLE_GROUP,
  SAMPLE_INDIVIDUAL,
} from "./ReportPDF.shared";

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
      assessmentsIncluded={groupData.assessmentsIncluded}
    />,
  );

  /** GROUP PAGES **/
  if (isGroup) {
    pages.push(
      <GroupEvaluationAssessments
        key="group-eval"
        width={width}
        height={height}
        skills={groupData.skills}
        horizontal={values.horizontal}
      />,
    );

    pages.push(
      <GroupThreeEye key="group-3eye" width={width} height={height} />,
    );

    pages.push(
      <GroupAIInsights
        key="group-ai"
        width={width}
        height={height}
        insights={computeInsightsGroup(groupData.skills)}
      />,
    );

    pages.push(
      <GroupRecommendations
        key="group-recs"
        width={width}
        height={height}
        skills={groupData.skills}
      />,
    );

    pages.push(
      <GroupROI
        key="group-roi"
        width={width}
        height={height}
        skills={groupData.skills}
      />,
    );
  }

  /** INDIVIDUAL PAGES **/
  if (isIndividual) {
    pages.push(
      <IndividualOverallProgress
        key="ind-progress"
        width={width}
        height={height}
        timeline={individualData.globalTimeline}
      />,
    );

    pages.push(
      <IndividualDetails
        key="ind-details"
        width={width}
        height={height}
        skills={individualData.skills}
        horizontal={values.horizontal}
      />,
    );

    pages.push(
      <IndividualThreeEye key="ind-3eye" width={width} height={height} />,
    );

    pages.push(
      <IndividualAIInsights
        key="ind-ai"
        width={width}
        height={height}
        lines={computeInsightsIndividual(individualData.globalTimeline)}
      />,
    );

    pages.push(
      <IndividualRecommendations
        key="ind-recs"
        width={width}
        height={height}
        skills={individualData.skills}
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
