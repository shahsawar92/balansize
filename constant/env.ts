export const isProd = process.env.NODE_ENV === "production";
export const isLocal = process.env.NODE_ENV === "development";

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === "true";

export const API_URL = isProd
  ? "https://staging.balansize.com/api/v1"
  : "https://staging.balansize.com/api/v1";

export const BASE_URL = isProd
  ? "https://staging.balansize.com"
  : "https://staging.balansize.com";
