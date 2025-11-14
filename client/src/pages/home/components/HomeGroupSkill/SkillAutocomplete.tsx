import React, { type FC } from "react";
import { useIntl } from "react-intl";

import { useMetricsThreeEyeViewControllerGetMetricsSkillsOptions } from "api/generated/metrics-three-eye-view/metrics-three-eye-view";
import FormikAutocomplete, {
  valueOptions,
} from "components/forms/FormikAutocomplete";

const SkillAutocomplete: FC<{ email?: string }> = ({ email }) => {
  const intl = useIntl();

  const { data: skills, isLoading } =
    useMetricsThreeEyeViewControllerGetMetricsSkillsOptions(
      { email },
      {
        query: {
          queryKey: ["metrics", "three-eye-view", "skills", email],
        },
      },
    );

  return (
    <FormikAutocomplete
      name="skill"
      placeholder={intl.formatMessage({
        id: "PAGE.HOME.SELECT_SKILL",
      })}
      label=""
      options={valueOptions(skills || [])}
      loading={isLoading}
      sx={{
        width: 200,
      }}
    />
  );
};

export default SkillAutocomplete;
