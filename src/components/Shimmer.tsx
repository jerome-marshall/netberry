import clsx from "clsx";
import type { FC } from "react";
import React from "react";

type Props = {
  height?: "sm" | "md" | "lg" | "xl";
  width?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
};

const varients = {
  height: {
    sm: "h-4",
    md: "h-5",
    lg: "h-6",
    xl: "h-7",
  },
  width: {
    xs: "w-[20%]",
    sm: "w-[40%]",
    md: "w-[60%]",
    lg: "w-[80%]",
    xl: "w-[100%]",
  },
};
const Shimmer: FC<Props> = ({ height, width, className }) => {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-[4px] bg-background-active_hover",
        height && varients?.height[height],
        width && varients?.width[width],
        className
      )}
    />
  );
};

export default Shimmer;
