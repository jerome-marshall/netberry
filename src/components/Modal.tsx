import { Dialog, Transition } from "@headlessui/react";
import type { ReactElement } from "react";
import { Fragment } from "react";
import { IoCloseSharp } from "react-icons/io5";

export default function Modal({
  isOpen,
  onClose,
  title,
  content,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string | ReactElement;
  content: ReactElement;
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-background-primary bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto">
          <div className="flex max-h-full justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full min-w-[500px] max-w-4xl transform overflow-hidden overflow-y-auto rounded-medium border-[2px] border-gray-darkest bg-background-secondary text-left align-middle transition-all">
                <Dialog.Title
                  as="div"
                  className={
                    "sticky top-0 z-10 flex justify-between border-b border-background-active_hover bg-background-secondary p-card_pad pb-3"
                  }
                >
                  <h3 className="text-xl font-semibold leading-6">{title}</h3>
                  <button type="button" onClick={onClose}>
                    <IoCloseSharp className="h-5 w-5" />
                  </button>
                </Dialog.Title>
                <Dialog.Description as="div" className="mt-2 pb-4">
                  <div>{content}</div>
                </Dialog.Description>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
