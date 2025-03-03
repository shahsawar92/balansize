export const isProd = process.env.NODE_ENV === "production";
export const isLocal = process.env.NODE_ENV === "development";

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === "true";

const usingNGROK = true;
export const API_URL = isProd
  ? "https://staging.balansize.com/api/v1"
  : usingNGROK
    ? "https://8zrc3pcc-4000.inc1.devtunnels.ms/api/v1"
    : "https://staging.balansize.com/api/v1";

export const BASE_URL = isProd
  ? "https://staging.balansize.com"
  : usingNGROK
    ? "https://8zrc3pcc-4000.inc1.devtunnels.ms"
    : "https://staging.balansize.com";
