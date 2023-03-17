import clsx from "clsx";
import Link from "next/link";
import type { FC } from "react";
import React from "react";
import { HiOutlineArrowSmRight } from "react-icons/hi";

interface CardProps {
  children: React.ReactNode;
  title: string;
  titleLink?: string;
  className?: string;
}
const Card: FC<CardProps> = ({ children, title, titleLink, className }) => {
  return (
    <div
      className={clsx(
        "flex flex-col rounded-medium border border-gray-darkest bg-background-secondary py-card_pad",
        className
      )}
    >
      <div className="card-header px-card_pad">
        <div
          className={clsx(
            "group flex w-fit items-center gap-2 pb-3",
            titleLink && "cursor-pointer"
          )}
        >
          <h3
            className={clsx(
              "text-2xl font-medium leading-none decoration-1",
              titleLink && "group-hover:underline"
            )}
          >
            {titleLink ? (
              <>
                <Link href={titleLink}>{title}</Link>
              </>
            ) : (
              title
            )}
          </h3>
          {titleLink && (
            <HiOutlineArrowSmRight className="relative top-[2px] left-0 h-6 w-6 transition-all duration-200 group-hover:left-1" />
          )}{" "}
        </div>
        <div className="divider"></div>
      </div>
      <div className="card-contents pt-card_pad">{children}</div>
    </div>
  );
};

export default Card;
