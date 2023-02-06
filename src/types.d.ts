export type NetlifySite = {
  id: string;
  site_id: string;
  name: string;
  screenshot_url: string;
  url: string;
  build_settings: {
    provider: string;
    repo_url: string;
  };
  published_deploy: {
    published_at: string;
  };
};

export type NetlifyDeploy = {
  id: string;
  site_id: string;
  created_at: string;
  published_at: string;
  ssl_url: string;
  state: string;
};
