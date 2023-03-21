import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import starberryLogo from "../assets/starberry-landscape-logo-white.png";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { tootTipStyle } from "../common/utils";

// interface HeaderProps {
//   children: React.ReactNode;
// }

const Footer: FC = () => {
  const year = new Date().getFullYear();
  return (
    <div className="footer flex items-end justify-between py-10">
      <div className="text-sm text-text-muted">Copyrights &copy; {year}</div>
      <div className="flex flex-col items-end">
        <div className="flex items-center text-sm text-text-muted">
          <span>NetBerry, a product of</span>{" "}
          <Link
            href={"https://starberry.tv/"}
            target="_blank"
            className="relative top-[1px]"
          >
            <Image
              src={starberryLogo}
              width={96}
              height={40}
              alt="starberry-logo"
            />
          </Link>
        </div>
        <div className="relative right-1 flex items-center text-sm text-text-muted">
          <span>Authored by</span>
          <Link
            href={"https://jerome-marshall.github.io/"}
            target="_blank"
            className=" ml-0.5 hover:text-white/90 hover:underline"
            data-tooltip-id="footer-tooltip"
            data-tooltip-content="Jerome Marshall"
          >
            JM
          </Link>
        </div>
      </div>
      <Tooltip id="footer-tooltip" style={tootTipStyle} />
    </div>
  );
};

export default Footer;
