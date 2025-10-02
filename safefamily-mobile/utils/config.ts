// utils/config.ts
import Constants from "expo-constants";

type Environment = "development" | "staging" | "production";

const ENV: Environment =
  (Constants?.manifest?.extra?.env as Environment) || "development";

const CONFIG = {
  development: {
    API_URL: "http://10.165.37.65:5000/api", // replace with LAN IPv4
  },
  staging: {
    API_URL: "https://staging.yourapp.com/api",
  },
  production: {
    API_URL: "https://yourapp.com/api",
  },
};

export default {
  ...CONFIG[ENV],
  ENV,
};