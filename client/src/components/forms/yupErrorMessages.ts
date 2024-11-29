import { setLocale } from "yup";

setLocale({
  mixed: {
    required: "Field is required",
  },
  // number: {
  //   min: ({ min, label }) => ({
  //     key: "FORMS.ERROR.FIELD_MIN",
  //     values: { label, min },
  //   }),
  //   max: ({ max, label }) => ({
  //     key: "FORMS.ERROR.FIELD_MAX",
  //     values: { label, max },
  //   }),
  // },
});
