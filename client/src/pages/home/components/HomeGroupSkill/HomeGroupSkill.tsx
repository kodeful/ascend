import React from "react";
import { TrendingUp } from "@mui/icons-material";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import { FormikProvider, useFormik } from "formik";

import Counter from "components/Counter/Counter";

import HomeGroupTestGraph from "./HomeGroupSkillGraph";
import SkillAutocomplete from "./SkillAutocomplete";

const HomeGroupSkill = () => {
  const formik = useFormik({
    initialValues: {
      skill: null,
    },
    onSubmit: () => {},
  });

  const { values } = formik;

  return (
    <Paper
      sx={{
        py: 2,
        px: 2,
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            <Typography fontSize={18} fontWeight={500} color="#60646C" mb={2}>
              Group Skill
            </Typography>

            <FormikProvider value={formik}>
              <SkillAutocomplete />
            </FormikProvider>
          </Stack>
        </Grid>
        {/* <Grid item xs={6}>
          <Typography fontSize={18} fontWeight={500} color="#60646C" mb={2}>
            Group Active Listening
          </Typography>
        </Grid> */}
        <Grid item xs={12}>
          {!values.skill && (
            <Typography
              fontSize={14}
              color="#60646C"
              fontWeight={500}
              textAlign="center"
              py={2}
            >
              Select a skill to see the graph
            </Typography>
          )}

          {values.skill && (
            <>
              <HomeGroupTestGraph height={240} />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontSize={14}>
                  <b>{values.skill}</b> has increased <Counter count={5.2} />%
                </Typography>
                <TrendingUp color="success" />
              </Stack>
            </>
          )}
        </Grid>
        {/* <Grid item xs={6}>
          <HomeGroupTestGraph height={240} />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontSize={14}>
              Has increased <Counter count={2} />%
            </Typography>
            <TrendingUp color="success" />
          </Stack>
        </Grid> */}
      </Grid>
    </Paper>
  );
};

export default HomeGroupSkill;
