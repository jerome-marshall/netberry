import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import type { ReactElement } from "react";
import { Fragment } from "react";

const MenuDropdown = ({
  Button,
  dropdownButtons,
  disabled,
  loading,
}: {
  Button: ReactElement;
  dropdownButtons?: ReactElement[];
  disabled?: boolean;
  loading?: boolean;
}) => {
  return (
    <div className=" text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button
            as="button"
            className={clsx("button", loading && "loading")}
            disabled={disabled}
          >
            {Button}
          </Menu.Button>
        </div>
        {dropdownButtons?.length && (
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="divide-gray-100 absolute left-0 mt-2 w-max origin-top-right divide-y rounded-md bg-background-active shadow-sm shadow-background-active_hover ring-1 ring-background-active focus:outline-none">
              <div className="px-1 py-1 ">
                {dropdownButtons.map((button, index) => (
                  <Menu.Item key={index}>
                    {({ active }) => (
                      <button
                        className={clsx(
                          "group flex w-full items-center rounded-md px-2 py-2 text-sm transition-all duration-100",
                          active ? "bg-background-alt_hover " : ""
                        )}
                      >
                        {button}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        )}
      </Menu>
    </div>
  );
};

export default MenuDropdown;
