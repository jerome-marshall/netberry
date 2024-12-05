import type { FC } from "react";
import { useEffect, useState } from "react";
import packageJson from "../../package.json";
import Modal from "./Modal";
import gif from "../assets/netberry.gif";

const ChangelogModal: FC = () => {
  const version = packageJson.version;

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const lastVersion = localStorage.getItem("lastVersion");
      if (lastVersion !== version) {
        openModal();
      } else {
        closeModal();
      }
      localStorage.setItem("lastVersion", version);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [version]);

  const Content = () => {
    return (
      <div className="px-card_pad">
        <h2 className=" text-lg font-semibold">✨ New Features</h2>
        <ul className="mt-3 list-outside list-disc pl-5 [&>*]:pt-1 [&>*]:text-sm">
          <li className="mb-4 !pt-0">
            <h3 className="inline font-semibold">Environment Variables</h3>
            <p className="mt-2">
              You can now <strong>add, edit and delete</strong> environment
              variables for each site.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gif.src}
              alt="Lock/Unlock Deployments GIF"
              className="mt-4 w-[50rem]"
            />
          </li>
          <li>
            <h3 className="inline font-semibold">Site Settings page</h3>
            <p className="mt-2">You can now access the site settings page.</p>
          </li>
          <li>
            <h3 className="inline font-semibold">Admin page</h3>
            <p className="mt-2">Admins can now access the admin page.</p>
          </li>
        </ul>
        <h2 className="mt-5 text-lg font-semibold">⚡ Improvements</h2>
        <ul className="mt-2 list-outside list-disc pl-5 [&>*]:pt-1 [&>*]:text-sm">
          <li className="!pt-0">
            You can now <strong>copy</strong> the env vars to the clipboard
            instead of downloading it.
          </li>
        </ul>
        <h2 className="mt-5 text-lg font-semibold">🐞 Bug Fixes</h2>
        <ul className="mt-2 list-outside list-disc pl-5 [&>*]:pt-1 [&>*]:text-sm">
          <li className="!pt-0">Fixed cancel deployment issue.</li>
          <li>Fixed response limit issue</li>
        </ul>
        <h2 className="mt-5 text-lg font-semibold">💿 Miscellaneous</h2>
        <ul className="mt-2 list-outside list-disc pl-5 [&>*]:pt-1 [&>*]:text-sm">
          <li className="!pt-0">Log every user actions.</li>
        </ul>

        <a
          href={
            "https://github.com/starberry/netberry-nextjs/blob/master/changelog.md"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="button button-teal sticky bottom-4 right-0 z-10  mt-8 ml-auto w-fit hover:ring hover:ring-teal-light"
        >
          <span>View All</span>
        </a>
      </div>
    );
  };

  return (
    <Modal
      content={<Content />}
      isOpen={isOpen}
      onClose={closeModal}
      title={
        <>
          What&apos;s new in{" "}
          <span className="animate-text relative bg-gradient-to-r from-green-light via-teal-lighter to-teal-light bg-clip-text font-black text-transparent">
            v{version}
          </span>
        </>
      }
    />
  );
};

export default ChangelogModal;
