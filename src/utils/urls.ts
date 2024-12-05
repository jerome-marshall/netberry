export const SitesLandingURL = "/sites";
export const AccountsLandingURL = "/accounts";
export const AccountsDetailURL = `${AccountsLandingURL}/[account_slug]`;
export const SitesDetailURL = `${AccountsDetailURL}/[site_id]`;
export const SiteSettingsURL = `${SitesDetailURL}/settings`;
export const SiteSettingsGeneralURL = `${SiteSettingsURL}/general`;
export const SiteSettingsEnvURL = `${SiteSettingsURL}/env`;
export const CreateSiteURL = `/admin/create-site`;

export const getAccountDetailURL = (accountSlug: string) => {
  return AccountsDetailURL.replace("[account_slug]", accountSlug);
};

export const getSiteDetailURL = (accountSlug: string, siteId: string) => {
  return SitesDetailURL.replace("[account_slug]", accountSlug).replace(
    "[site_id]",
    siteId
  );
};

export const getSiteSettingsURL = (accountSlug: string, siteId: string) => {
  return SiteSettingsURL.replace("[account_slug]", accountSlug).replace(
    "[site_id]",
    siteId
  );
};

export const getSiteSettingsEnvURL = (accountSlug: string, siteId: string) => {
  return SiteSettingsEnvURL.replace("[account_slug]", accountSlug).replace(
    "[site_id]",
    siteId
  );
};
