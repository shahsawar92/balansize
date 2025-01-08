/**
 * @type {import('next-sitemap').IConfig}
 */
export const siteUrl = 'balansize.com';
export const generateRobotsTxt = true;
export const robotsTxtOptions = {
  policies: [{ userAgent: '*', allow: '/' }],
};
