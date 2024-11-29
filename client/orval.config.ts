import { config } from "dotenv";
import { defineConfig } from "orval";

config();

export default defineConfig({
  api: {
    output: {
      mode: "tags-split",
      target: "src/api/generated/api.ts",
      schemas: "src/api/generated/models",
      client: "react-query",
      clean: true,
      override: {
        mutator: {
          path: "./src/api/axios-instance.ts",
          name: "axiosInstance",
        },
      },
    },
    input: {
      target: process.env.REACT_APP_API_URL
        ? `${process.env.REACT_APP_API_URL}/web/swagger.json`
        : "unknown_url",
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
});
