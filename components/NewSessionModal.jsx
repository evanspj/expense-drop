import dynamic from 'next/dynamic';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { overlayVariants, modalVariants } from '@utils/animations';
import { state } from '@store';
import { useSnapshot } from 'valtio';

const Dropzone = dynamic(() => import('./Dropzone'));

export default function NewSessionModal() {
  const { newSessionModal } = useSnapshot(state);

  function closeModal() {
    state.newSessionModal = false;
  }

  function setNewSession() {
    closeModal();
    state.session = null;
    toast('Started a new session');
  }

  return (
    <AnimatePresence>
      {newSessionModal && (
        <Dialog
          as={motion.div}
          static
          open
          key="add-transactions-modal"
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 flex justify-center items-center px-4 md:px-0 z-40 overflow-y-auto"
          onClose={closeModal}
        >
          <Dialog.Overlay
            as={motion.div}
            variants={overlayVariants}
            className="fixed inset-0 firefox:bg-black/50 bg-black/20 backdrop-blur-sm"
          />
          <motion.div variants={modalVariants}>
            <div className="inline-block w-full max-w-lg text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="px-6 pt-6 md:px-8 md:pt-8">
                <Dialog.Title className="font-bold text-xl 3xl:text-2xl mb-2">
                  New Session
                </Dialog.Title>
                <Dialog.Description className="text-xs 3xl:text-sm text-gray-500">
                  By starting a new session all current transactions will be
                  replaced with the new transactions from the file you upload.
                </Dialog.Description>
                <div className="h-[200px] my-6 md:my-8">
                  <Dropzone callback={setNewSession} />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  className="w-full h-14 bg-gray-200 text-xs 3xl:text-sm font-medium text-gray-500 hover:bg-gray-300 hover:text-black  rounded-b-lg"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
