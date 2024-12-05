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
  deploy_time?: number;
  links?: {
    permalink?: string;
  };
  locked?: boolean;
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

export type NetlifyHook = {
  id: string;
  title: string;
  branch: string;
  url: string;
  site_id: string;
  created_at: string;
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
  account_id: string;
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
    framework?: string;
    locked?: boolean;
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

export interface GithubRes {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepo[];
}

export interface GitHubRepo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: GitHubOwner;
  html_url: string;
  description: null | string;
  url: string;
}

export interface GitHubOwner {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  repos_url: string;
  type: string;
  site_admin: boolean;
}

interface ENVKeyValue {
  key: string;
  values: { value: string; context: string }[];
}
