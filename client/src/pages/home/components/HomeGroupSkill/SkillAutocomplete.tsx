import React, { type FC } from "react";
import { useIntl } from "react-intl";

import { useMetricsControllerGetMetricsSkillsOptions } from "api/generated/metrics/metrics";
import FormikAutocomplete, {
  valueOptions,
} from "components/forms/FormikAutocomplete";

const SkillAutocomplete: FC = () => {
  const intl = useIntl();

  const { data: skills, isLoading } =
    useMetricsControllerGetMetricsSkillsOptions();

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
