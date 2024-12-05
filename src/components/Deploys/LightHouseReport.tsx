import clsx from "clsx";
import _ from "lodash";
import type { NetlifyDeploy } from "../../types";

interface LightHouseReportProps {
  deploy: NetlifyDeploy;
}

const LightHouseReport = ({ deploy }: LightHouseReportProps) => {
  const { lighthouse } = deploy;

  if (!lighthouse || _.isEmpty(lighthouse?.averages)) return null;

  const {
    averages: {
      performance,
      accessibility,
      "best-practices": bestPractices,
      seo,
    },
  } = lighthouse;

  const getTheme = (score: number) => {
    if (score >= 90) {
      return "bg-green-dark text-green-light";
    }
    if (score >= 50) {
      return "bg-gold-dark text-gold-light";
    }
    return "bg-red-dark text-red-lighter";
  };

  const ScoreItem = ({ score, label }: { score: number; label: string }) => {
    return (
      <div className="flex flex-col items-center">
        <p
          className={clsx(
            "flex h-[30px] w-[30px] items-center justify-center rounded-full text-xs",
            getTheme(score)
          )}
        >
          {score}
        </p>
        <p className="mt-[2px] text-[9px] text-white">{label}</p>
      </div>
    );
  };

  return (
    <div className="flex gap-2">
      <ScoreItem score={performance} label="PERF" />
      <ScoreItem score={accessibility} label="A11Y" />
      <ScoreItem score={bestPractices} label="BP" />
      <ScoreItem score={seo} label="SEO" />
    </div>
  );
};

export default LightHouseReport;
