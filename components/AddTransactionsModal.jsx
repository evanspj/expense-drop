import dynamic from 'next/dynamic';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { overlayVariants, modalVariants } from '@utils/animations';
import { state } from '@store';
import { useSnapshot } from 'valtio';

const Dropzone = dynamic(() => import('./Dropzone'));

export default function AddTransactionsModal() {
  const { addTransactionsModal } = useSnapshot(state);

  function closeModal() {
    state.addTransactionsModal = false;
  }

  function dropzoneCallback() {
    closeModal();
    toast.success('New transactions added!');
  }

  return (
    <AnimatePresence>
      {addTransactionsModal && (
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
            <div className="inline-block w-full max-w-lg text-left align-middle transition-all transform bg-white shadow-xl rounded-lg ">
              <div className="px-6 pt-6 md:px-8 md:pt-8">
                <Dialog.Title className="font-bold text-xl 3xl:text-3xl mb-2">
                  Add Transactions
                </Dialog.Title>
                <Dialog.Description className="text-xs 3xl:text-sm text-gray-500">
                  The transaction data from the file you upload will be added to
                  your current session data. Be careful not to add transaction
                  data that is already in the current session or it will be
                  duplicated.
                </Dialog.Description>
                <div className="h-[200px] my-6 md:my-8">
                  <Dropzone addTransactions callback={dropzoneCallback} />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  className="w-full h-14 bg-gray-200 text-xs 3xl:text-sm font-medium hover:bg-gray-300  rounded-b-lg"
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
