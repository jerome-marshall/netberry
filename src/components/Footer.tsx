import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import starberryLogo from "../assets/starberry-landscape-logo-white.png";

// interface HeaderProps {
//   children: React.ReactNode;
// }

const Footer: FC = () => {
  const year = new Date().getFullYear();
  return (
    <div className="footer mt-auto flex items-center justify-between py-10">
      <div className="text-sm text-text-muted">Copyrights &copy; {year}</div>
      <div className="flex items-center text-sm text-text-muted">
        <span>NetBerry, a product of</span>{" "}
        <Link href={"https://starberry.tv/"} target="_blank">
          <Image
            src={starberryLogo}
            width={96}
            height={40}
            alt="starberry-logo"
          />
        </Link>
      </div>
    </div>
  );
};

export default Footer;
