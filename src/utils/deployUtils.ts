import {
  format,
  formatDuration,
  intervalToDuration,
  isToday,
  isYesterday,
} from "date-fns";
import type { NetlifyDeploy } from "./../types";

export const STATUS_THEME = {
  teal: "teal",
  red: "red",
  grey: "grey",
  gold: "gold",
};

export const DEPLOY_STATUS = {
  cancelled: "cancelled",
  failed: "failed",
  unknown: "unknown",
  new: "new",
  published: "published",
};

export const DEPLOY_STATE = {
  error: "error",
  new: "new",
  unknown: "unknown",
  ready: "ready",
};

export const DEPLOY_STATUS_THEME = {
  published: {
    status: DEPLOY_STATUS.published,
    theme: STATUS_THEME.teal,
  },
  cancelled: {
    status: DEPLOY_STATUS.cancelled,
    theme: STATUS_THEME.grey,
  },
  failed: {
    status: DEPLOY_STATUS.failed,
    theme: STATUS_THEME.red,
  },
  new: {
    status: DEPLOY_STATUS.new,
    theme: STATUS_THEME.gold,
  },
  unknown: {
    status: DEPLOY_STATUS.unknown,
    theme: STATUS_THEME.grey,
  },
};

export const getDeployStatus = (deploy: NetlifyDeploy) => {
  let status = DEPLOY_STATUS_THEME.unknown;

  const { state, error_message } = deploy;

  switch (state) {
    case DEPLOY_STATE.error:
      if (error_message === "Canceled build") {
        status = DEPLOY_STATUS_THEME.cancelled;
      } else {
        status = DEPLOY_STATUS_THEME.failed;
      }
      break;
    case DEPLOY_STATE.new:
      status = DEPLOY_STATUS_THEME.new;
      break;
    case DEPLOY_STATE.ready:
      status = DEPLOY_STATUS_THEME.published;
      break;

    default:
      status = DEPLOY_STATUS_THEME.unknown;
      break;
  }

  return status;
};

export const getStatusTheme = (theme: string) => {
  if (theme === STATUS_THEME.gold) return "status-gold";
  if (theme === STATUS_THEME.red) return "status-red";
  if (theme === STATUS_THEME.grey) return "status-grey";
  if (theme === STATUS_THEME.teal) return "status-teal";
};

export const getDeployTime = (date_str: string) => {
  let result = "";
  const date = new Date(date_str);
  const formatedDate = format(date, "LLL dd");
  const formatedTime = format(date, "p");

  if (isToday(date)) result += `Today at `;
  else if (isYesterday(date)) result += `Yesterday at `;
  else result += `${formatedDate} at `;

  result += formatedTime;

  return result;
};

export const getDeployDuration = (start: string, end: string) => {
  const interval = intervalToDuration({
    start: new Date(start),
    end: new Date(end),
  });
  const duration = formatDuration(interval, { zero: false })
    .replace(" years", "y")
    .replace(" year", "y")
    .replace(" months", "M")
    .replace(" month", "M")
    .replace(" days", "d")
    .replace(" day", "d")
    .replace(" minutes", "m")
    .replace(" minute", "m")
    .replace(" seconds", "s")
    .replace(" second", "s");
  return duration;
};

export const getDeployMessage = (deploy: NetlifyDeploy) => {
  const { error_message, title } = deploy;

  let message = title || error_message;
  message ||= "No deploy message";

  return message;
};
