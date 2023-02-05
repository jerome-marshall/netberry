import Link from "next/link";
import type { FC } from "react";
import React from "react";

interface CardProps {
  children: React.ReactNode;
  title: string;
  titleLink: string;
}
const Card: FC<CardProps> = ({ children, title, titleLink }) => {
  return (
    <div className="flex flex-col rounded-medium bg-background-secondary py-card_pad">
      <div className="card-header px-card_pad">
        <h3 className="pb-3 text-2xl font-medium">
          <Link href={titleLink}>{title}</Link>
        </h3>
        <div className="divider"></div>
      </div>
      <div className="card-contents pt-card_pad">{children}</div>
    </div>
  );
};

export default Card;
