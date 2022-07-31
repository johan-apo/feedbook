import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config();

export default defineConfig({
  env: {
    auth0_username: process.env.AUTH0_USERNAME,
    auth0_password: process.env.AUTH0_PASSWORD,
    auth0_domain: process.env.AUTH0_DOMAIN,
    auth0_audience: process.env.AUTH0_AUDIENCE,
    auth0_scope: process.env.AUTH0_SCOPE,
    auth0_client_id: process.env.AUTH0_CLIENT_ID,
    auth0_client_secret: process.env.AUTH0_CLIENT_SECRET,
    auth0_cookie_secret: process.env.AUTH0_COOKIE_SECRET,
  },
  e2e: {
    experimentalSessionAndOrigin: true,
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {},
  },
});
