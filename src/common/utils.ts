import { SiGatsby, SiNextdotjs, SiReact, SiVuedotjs } from "react-icons/si";
import { TbBrandNextjs } from "react-icons/tb";

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

export const brand = "NetBerry";
