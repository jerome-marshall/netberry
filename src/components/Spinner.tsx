import clsx from "clsx";
import type { FC } from "react";

type Props = {
  className?: string;
};

const Spinner: FC<Props> = ({ className }) => {
  return (
    <div
      className={clsx(
        "border-current inline-block h-8 w-8 animate-spin rounded-[50%] border-4 border-solid border-r-transparent",
        className
      )}
    ></div>
  );
};

export default Spinner;
