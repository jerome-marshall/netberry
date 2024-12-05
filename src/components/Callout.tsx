import clsx from "clsx";
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";

const VARIANTS = {
  info: {
    bg: "bg-blue-darker",
    text: "text-white",
    border: "bg-blue-light",
    emoji: "ℹ️",
  },
  success: {
    bg: "bg-green-darker",
    text: "text-white",
    border: "bg-green-light",
    emoji: "✅",
  },
  warning: {
    bg: "bg-gold-darker",
    text: "text-white",
    border: "bg-gold-light",
    emoji: "💡",
  },
  danger: {
    bg: "bg-red-dark",
    text: "text-white",
    border: "bg-red-alt",
    emoji: "🚨",
  },
};

interface CalloutProps {
  variant: keyof typeof VARIANTS;
  text: string;
  showCallout: boolean;
}

const Callout: FC<CalloutProps> = ({ variant, text, showCallout }) => {
  const [show, setShow] = useState(showCallout);

  useEffect(() => {
    setShow(showCallout);
  }, [showCallout]);

  if (!show) return null;

  const hide = () => {
    setShow(false);
  };

  return (
    <div className="relative my-6 overflow-hidden rounded-medium">
      <div
        className={clsx("absolute top-0 h-2 w-full ", VARIANTS[variant].border)}
      ></div>
      <div
        className={clsx(
          "flex items-start p-card_pad ",
          VARIANTS[variant].bg,
          VARIANTS[variant].text
        )}
      >
        <div className="flex items-start">
          <span className="mr-2">{VARIANTS[variant].emoji}</span>
          <span
            className={clsx("text-sm leading-relaxed", VARIANTS[variant].text)}
          >
            {text}
          </span>
        </div>
        <button
          className={clsx("ml-auto pl-10 text-white", VARIANTS[variant].text)}
          onClick={hide}
        >
          <IoIosClose className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Callout;
