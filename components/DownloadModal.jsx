import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { overlayVariants, modalVariants } from '@utils/animations';
import { state } from '@store';
import { useSnapshot } from 'valtio';

export default function DownloadModal() {
  const { downloadModal, transactions, session } = useSnapshot(state);
  const [fileName, setFileName] = useState(session?.sessionName || 'Expenses');

  async function closeModal() {
    state.downloadModal = false;
    setFileName(session?.sessionName || 'Expenses');
  }

  async function downloadFile() {
    const XLSX = (await import('@utils/sheetjs')).default;
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      transactions.map((t) => ({
        Date: t.Date,
        Description: t.Description,
        Amount: t.Amount,
        Category: t.Category,
        Account: t.Account
      }))
    );

    XLSX.utils.book_append_sheet(workbook, worksheet, 'expenses');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    closeModal();
  }

  return (
    <AnimatePresence>
      {downloadModal && (
        <Dialog
          as={motion.div}
          static
          open
          key="download-modal"
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
            <div className="inline-block w-full md:min-w-[400px] max-w-md text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="px-6 pt-6 md:px-8 md:pt-8">
                <Dialog.Title className="font-bold text-xl 3xl:text-2xl mb-2">
                  Download xlsx File
                </Dialog.Title>
                <Dialog.Description className="text-xs 3xl:text-sm text-gray-500">
                  Give the file a name and download the transactions to an excel
                  file.
                </Dialog.Description>

                <div className="my-6 md:my-8">
                  <form className="flex flex-col">
                    <label className="hidden">Session Name</label>
                    <input
                      className="w-full h-[40px] text-sm bg-gray-100  border border-gray-300 hover:border-gray-500  rounded-md px-3"
                      placeholder="Session Name"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                    />
                  </form>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  className="w-full h-14 bg-gray-200 text-xs 3xl:text-sm font-medium hover:bg-gray-300  rounded-bl-lg"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="w-full h-14 bg-gray-800 text-xs 3xl:text-sm font-medium text-white hover:bg-gray-700 rounded-br-lg"
                  onClick={downloadFile}
                >
                  Download
                </button>
              </div>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
