import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { overlayVariants, modalVariants } from '@utils/animations';

export default function DeleteSessionsConfirmationModal({
  hasMultipleSessions,
  deleteSessions,
  showDeleteModal,
  hideDeleteModal
}) {
  function confirmDelete() {
    deleteSessions();
    hideDeleteModal();
  }

  return (
    <AnimatePresence>
      {showDeleteModal && (
        <Dialog
          as={motion.div}
          static
          open
          key="add-transactions-modal"
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 flex justify-center items-center z-40"
          onClose={hideDeleteModal}
        >
          <Dialog.Overlay
            as={motion.div}
            variants={overlayVariants}
            className="fixed inset-0 bg-black/40"
          />
          <motion.div variants={modalVariants}>
            <div className="inline-block w-full max-w-md text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="px-6 pt-6 md:px-8 md:pt-8">
                <Dialog.Title className="font-bold text-xl 3xl:text-3xl mb-2">
                  Delete {hasMultipleSessions ? 'Sessions' : 'Session'}
                </Dialog.Title>
                <Dialog.Description className="text-xs 3xl:text-sm text-gray-500 my-6 md:my-8">
                  By pressing the &quot;Confirm Delete&quot; button, you will
                  permanently delete the saved{' '}
                  {hasMultipleSessions ? 'sessions' : 'session'} you selected
                  from your browser&apos;s storage. This action is irreversible.
                </Dialog.Description>
              </div>
              <div className="flex justify-end">
                <button
                  className="w-full h-14 bg-gray-200 text-xs 3xl:text-sm font-medium hover:bg-gray-300 rounded-bl-lg"
                  onClick={hideDeleteModal}
                >
                  Cancel
                </button>
                <button
                  className="w-full h-14 bg-gray-800 text-xs 3xl:text-sm font-medium text-white hover:bg-gray-700 rounded-br-lg"
                  onClick={confirmDelete}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
