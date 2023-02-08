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

export type BuildTriggerRes = {
  id: string;
  deploy_id: string;
  done: boolean;
  error: unknown;
  created_at: string;
  deploy_state: string;
  deploy_pending_review_reason: string;
};

export type NetlifyDeploy = {
  id: string;
  site_id: string;
  created_at: string;
  published_at: string;
  ssl_url: string;
  state: string;
  error_message: string;
  title: string;
  branch: string;
  context: string;
  deploy_url: string;
};
