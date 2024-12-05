import type { FC } from "react";
import React from "react";
import { Tooltip as ToolTip } from "@nextui-org/react";

type TooltipProps = {
  children: React.ReactNode;
  content?: string;
  delay?: boolean;
};

const Tooltip: FC<TooltipProps> = ({ children, content, delay }) => {
  content ||= "ctrl + click to open";
  return (
    <ToolTip
      content={content}
      enterDelay={delay ? 300 : 0}
      className="!inline"
      portalClassName="tooltip"
      offset={8}
    >
      {children}
    </ToolTip>
  );
};

export default Tooltip;
