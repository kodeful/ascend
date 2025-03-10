import React, { type FC } from "react";

import { useMetricsControllerGetMetricsSkillsOptions } from "api/generated/metrics/metrics";
import FormikAutocomplete, {
  valueOptions,
} from "components/forms/FormikAutocomplete";

const SkillAutocomplete: FC = () => {
  const { data: skills, isLoading } =
    useMetricsControllerGetMetricsSkillsOptions();

  return (
    <FormikAutocomplete
      name="skill"
      placeholder="Select skill"
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
