import clsx from "clsx";
import { GoChevronRight } from "react-icons/go";

const RightArrow = ({ className }: { className?: string }) => {
  return (
    <GoChevronRight
      className={clsx(
        "transition-custom h-3 w-3 text-text-muted group-hover:text-white",
        className
      )}
    />
  );
};

export default RightArrow;
