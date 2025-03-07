export const isProd = process.env.NODE_ENV === "production";
export const isLocal = process.env.NODE_ENV === "development";

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === "true";

const usingNGROK = false;
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

export const editorKey = "9t2013wyl9fddg51poprfagpmv9n4ms1va1c9qiff2xlqt74";
// teh key fsbnr3zlo2q5fwqpmqb4jdwe24d8to5v8jtu00dbh87piwca
