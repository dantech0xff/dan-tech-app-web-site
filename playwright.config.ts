import { defineConfig, devices } from "@playwright/test";

const PORT = 4311;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    // Browser-free unit specs only need to run once.
    { name: "mobile", use: { ...devices["Pixel 7"] }, testIgnore: /\.unit\.spec\.ts$/ },
  ],
  // Tests run against the static export, served the way production hosts serve it.
  webServer: {
    command: "npm run build && npm run start",
    url: BASE_URL,
    env: { PORT: String(PORT) },
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
