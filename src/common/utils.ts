import { format, formatDistanceToNow } from "date-fns";
import type { CSSProperties } from "react";
import { SiGatsby, SiNextdotjs, SiReact, SiVuedotjs } from "react-icons/si";
import type { SiteWithAccount } from "../types";

export const getRepoProviderText = (provider: string | undefined) => {
  switch (provider) {
    case "github":
      return "GitHub";
    case "gitlab":
      return "GitLab";
    case "bitbucket":
      return "BitBucket";
    default:
      return "Here";
  }
};
export const getFrameworkInfo = (framework: string | undefined) => {
  const frameworkInfo = {
    icon: SiGatsby,
    name: "",
  };

  switch (framework) {
    case "gatsby":
      frameworkInfo.icon = SiGatsby;
      frameworkInfo.name = "Gatsby";
      break;
    case "next":
      frameworkInfo.icon = SiNextdotjs;
      frameworkInfo.name = "Next.js";
      break;
    case "react":
      frameworkInfo.icon = SiReact;
      frameworkInfo.name = "React";
      break;
    case "vue":
      frameworkInfo.icon = SiVuedotjs;
      frameworkInfo.name = "Vue";
      break;
    default:
      return null;
  }

  return frameworkInfo;
};

export const sortSites = (a: SiteWithAccount, b: SiteWithAccount) => {
  const aPublishedAt = a.published_deploy?.published_at;
  const bPublishedAt = b.published_deploy?.published_at;
  if (aPublishedAt && bPublishedAt) {
    return new Date(bPublishedAt).getTime() - new Date(aPublishedAt).getTime();
  }
  if (!aPublishedAt && bPublishedAt) {
    return 1;
  }
  if (aPublishedAt && !bPublishedAt) {
    return -1;
  }
  return -1;
};

export const tootTipStyle: CSSProperties = {
  backgroundColor: "#272f38",
  border: "1px solid #4d565f",
  padding: "5px 10px",
  fontSize: "12px",
  opacity: 1,
};

export const getPublishedDate = (pDate: string | number | Date | undefined) => {
  if (!pDate) return { formatedDate: null, timeInterval: null };

  const date = new Date(pDate);

  const formatedDate = format(date, "LLL dd");

  const timeInterval =
    pDate &&
    formatDistanceToNow(date, {
      addSuffix: true,
    })
      .replace("about", "")
      .trim();

  return {
    formatedDate,
    timeInterval,
  };
};

export const brand = "NetBerry";
