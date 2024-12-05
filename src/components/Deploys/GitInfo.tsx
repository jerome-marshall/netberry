import type { FC } from "react";
import React from "react";
import type { NetlifyDeploy, SiteWithAccount } from "../../types";
import Link from "next/link";

interface GitInfoProps {
  deploy: NetlifyDeploy;
  className?: string;
  siteInfo: SiteWithAccount;
}

const GitInfo: FC<GitInfoProps> = ({ deploy, className, siteInfo }) => {
  const { context, branch, published_at, deploy_url } = deploy;

  const repoUrl = siteInfo?.build_settings?.repo_url;
  return (
    <p className={className}>
      {published_at ? (
        <Link
          href={deploy_url}
          target="_blank"
          rel="noreferrer"
          className="font-semibold capitalize underline decoration-text-muted hover:text-white hover:decoration-white hover:decoration-2"
        >
          {context}
        </Link>
      ) : (
        <span className="capitalize">{context}</span>
      )}
      {": "}
      {branch}
      {repoUrl && (
        <>
          @
          <Link
            href={`${repoUrl}/tree/${branch}`}
            target="_blank"
            rel="noreferrer"
            className="text-[80%] underline decoration-text-muted hover:text-white hover:decoration-white"
          >
            HEAD
          </Link>
        </>
      )}
    </p>
  );
};

export default GitInfo;
