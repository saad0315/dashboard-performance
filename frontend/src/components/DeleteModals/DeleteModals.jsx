import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import IconX from '../Icon/IconX';

const DeleteModals = ({ isOpen, onClose, onDelete }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" open={isOpen} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0" />
        </Transition.Child>
        <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
          <div className="flex items-start justify-center min-h-screen px-4">
            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark animate__animated animate__slideInDown">
              <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                <h5 className="font-bold text-lg">Warning !</h5>
                <button onClick={onClose} type="button" className="text-white-dark hover:text-dark">
                  <IconX />
                </button>
              </div>
              <div className="p-5">
                <p>Are you sure you want to delete?</p>
                <div className="flex justify-end items-center mt-8">
                  <button onClick={onClose} type="button" className="btn btn-outline-danger">
                    Discard
                  </button>
                  <button onClick={onDelete} type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                    Yes
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteModals;
