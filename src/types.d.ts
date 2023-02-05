export type NetlifySite = {
  id: string;
  site_id: string;
  name: string;
};

export type NetlifyDeploy = {
  id: string;
  site_id: string;
  created_at: string;
  published_at: string;
  ssl_url: string;
  state: string;
};
