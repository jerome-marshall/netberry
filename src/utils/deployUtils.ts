import {
  format,
  formatDuration,
  intervalToDuration,
  isToday,
  isYesterday,
} from "date-fns";
import type { NetlifyDeploy } from "./../types";

export const STATUS_THEME = {
  green: "green",
  red: "red",
  grey: "grey",
  gold: "gold",
} as const;

// deploy state from Netlify API
export const DEPLOY_STATE = {
  error: "error",
  new: "new",
  unknown: "unknown",
  building: "building",
  ready: "ready",
  enqueued: "enqueued",
  uploading: "uploading",
  preparing: "preparing",
  processing: "processing",
  rejected: "rejected",
  prepared: "prepared",
} as const;

// deploy status to display
export const DEPLOY_STATUS = {
  cancelled: "cancelled",
  failed: "failed",
  unknown: "unknown",
  new: "new",
  published: "published",
  processing: "processing",
  publishing: "publishing",
  building: "building",
  waiting: "waiting",
  skipped: "skipped",
  rejected: "rejected",
  prepared: "build ready",
} as const;

export const DEPLOY_STATUS_THEME = {
  published: {
    status: DEPLOY_STATUS.published,
    theme: STATUS_THEME.green,
  },
  building: {
    status: DEPLOY_STATUS.building,
    theme: STATUS_THEME.gold,
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
  enqueued: {
    status: DEPLOY_STATUS.waiting,
    theme: STATUS_THEME.gold,
  },
  uploading: {
    status: DEPLOY_STATUS.publishing,
    theme: STATUS_THEME.gold,
  },
  processing: {
    status: DEPLOY_STATUS.processing,
    theme: STATUS_THEME.gold,
  },
  prepared: {
    status: DEPLOY_STATUS.prepared,
    theme: STATUS_THEME.gold,
  },
  skipped: {
    status: DEPLOY_STATUS.skipped,
    theme: STATUS_THEME.grey,
  },
  rejected: {
    status: DEPLOY_STATUS.rejected,
    theme: STATUS_THEME.grey,
  },
  unknown: {
    status: DEPLOY_STATUS.unknown,
    theme: STATUS_THEME.grey,
  },
};

export const getDeployStatus = (deploy: NetlifyDeploy) => {
  let status: {
    status: typeof DEPLOY_STATUS[keyof typeof DEPLOY_STATUS];
    theme: typeof STATUS_THEME[keyof typeof STATUS_THEME];
  } = DEPLOY_STATUS_THEME.unknown;

  const { state, error_message } = deploy;

  switch (state) {
    case DEPLOY_STATE.error:
      if (error_message === "Canceled build") {
        status = DEPLOY_STATUS_THEME.cancelled;
      } else if (error_message === "Skipped") {
        status = DEPLOY_STATUS_THEME.skipped;
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
    case DEPLOY_STATE.building:
      status = DEPLOY_STATUS_THEME.building;
      break;
    case DEPLOY_STATE.enqueued:
      status = DEPLOY_STATUS_THEME.enqueued;
      break;
    case DEPLOY_STATE.uploading:
      status = DEPLOY_STATUS_THEME.uploading;
      break;
    case DEPLOY_STATE.processing:
      status = DEPLOY_STATUS_THEME.processing;
      break;
    case DEPLOY_STATE.preparing:
      status = DEPLOY_STATUS_THEME.processing;
      break;
    case DEPLOY_STATE.prepared:
      status = DEPLOY_STATUS_THEME.prepared;
      break;
    case DEPLOY_STATE.rejected:
      status = DEPLOY_STATUS_THEME.rejected;
      break;

    default:
      status = DEPLOY_STATUS_THEME.unknown;
      break;
  }

  return status;
};

export const getDeplayStatusText = (status: string) => {
  switch (status) {
    case DEPLOY_STATUS.published:
      return "successful";
    case DEPLOY_STATUS.building:
      return "building";
    case DEPLOY_STATUS.cancelled:
      return "cancelled";
    case DEPLOY_STATUS.failed:
      return "failed";
    case DEPLOY_STATUS.new:
      return "not started";
    case DEPLOY_STATUS.waiting:
      return "waiting";
    case DEPLOY_STATUS.publishing:
      return "publishing";
    case DEPLOY_STATUS.skipped:
      return "skipped";
    case DEPLOY_STATUS.unknown:
      return "unknown";
    default:
      return "Unknown";
  }
};

export const getStatusTheme = (theme: string) => {
  if (theme === STATUS_THEME.gold) return "status-gold";
  if (theme === STATUS_THEME.red) return "status-red";
  if (theme === STATUS_THEME.grey) return "status-grey";
  if (theme === STATUS_THEME.green) return "status-green";
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

export const getDeployDuration = (deploy_time: number) => {
  const interval = intervalToDuration({
    start: 0,
    end: deploy_time * 1000,
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
