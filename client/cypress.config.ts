import { defineConfig } from "cypress";

require("dotenv").config();

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3101",
    setupNodeEvents(on, config) {
      // implement node event listeners here

      config.baseUrl = import.meta.env.CYPRESS_BASE_URL;
      config.env.API_URL = import.meta.env.REACT_APP_API_URL;
      config.env.AUTH_EMAIL = import.meta.env.CYPRESS_AUTH_EMAIL;
      config.env.AUTH_PASSWORD = import.meta.env.CYPRESS_AUTH_PASSWORD;

      return config;
    },
  },
});
