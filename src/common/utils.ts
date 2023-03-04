export const getRepoProviderText = (provider: string | undefined) => {
  switch (provider) {
    case "github":
      return "GitHub";
    case "gitlab":
      return "GitLab";
    case "bitbucket":
      return "Bitbucket";
    default:
      return "Here";
  }
};
