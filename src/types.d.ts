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
  links?: {
    permalink?: string;
  };
  lighthouse?: {
    averages?: {
      accessibility: number;
      "best-practices": number;
      performance: number;
      seo: number;
      pwa: number;
    };
  };
};

export type AccountCustom = {
  id: string;
  name: string;
  email: string;
  slug: string;
  token?: string;
  isFavourite: boolean;
};

export type AccountNoToken = Omit<AccountCustom, "token">;

export type Site = {
  id: string;
  site_id: string;
  name: string;
  screenshot_url?: string;
  url: string;
  ssl_url?: string;
  build_settings?: {
    provider: string;
    repo_url: string;
    repo_branch: string;
    repo_path: string;
    env: Record<string, string>;
  };
  repo_url: string;
  published_deploy: {
    published_at: string;
    id: string;
  };
  admin_url: string;
  account_slug: string;
};

export type SiteWithAccount = Site & {
  account: AccountNoToken;
  isFavourite?: boolean;
};

export type SiteEnv = {
  key: string;
  scopes: Array<"builds" | "functions" | "post_processing" | "runtime">;
  values: {
    id: string;
    value: string;
    context: "all" | "dev" | "branch-deploy" | "deploy-preview" | "production";
    role: string;
  }[];
  updated_at: Date;
};

export type FavSite = {
  site_id: string;
  account_token: string;
  account_slug: string;
};
