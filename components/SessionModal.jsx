import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { overlayVariants, modalVariants } from '@utils/animations';
import { state, db, updateSession } from '@store';
import { useSnapshot } from 'valtio';
import { sortDateDesc, encryptData } from '@utils/helpers';

export default function SessionModal() {
  const { sessionModal, transactions, session } = useSnapshot(state);
  const [savingData, setSavingData] = useState(false);
  const [sessionName, setSessionName] = useState(
    new Intl.DateTimeFormat('en-US').format(new Date())
  );

  useEffect(() => {
    if (!session?.sessionName) return;
    setSessionName(session.sessionName);
  }, [session]);

  async function closeModal() {
    state.sessionModal = false;
  }

  async function saveSession(e) {
    e.preventDefault();
    setSavingData(true);
    const sortedTransactions = transactions
      .map((t) => ({ ...t }))
      .sort(sortDateDesc);
    const encryptedData = await encryptData(sortedTransactions);

    const sesh = {
      sessionName: sessionName,
      transactions: encryptedData,
      created: new Date(),
      modified: new Date()
    };

    // Enable persistent data storage via StorageManager if available
    async function tryPersistWithoutPromtingUser() {
      if (!navigator.storage || !navigator.storage.persisted) {
        return 'never';
      }
      let persisted = await navigator.storage.persisted();
      if (persisted) {
        return 'persisted';
      }
      if (!navigator.permissions || !navigator.permissions.query) {
        return 'prompt';
      }
      const permission = await navigator.permissions.query({
        name: 'persistent-storage'
      });
      if (permission.state === 'granted') {
        persisted = await navigator.storage.persist();
        if (persisted) {
          return 'persisted';
        } else {
          throw new Error('Failed to persist');
        }
      }
      if (permission.state === 'prompt') {
        return 'prompt';
      }
      return 'never';
    }

    async function initStoragePersistence() {
      const persist = await tryPersistWithoutPromtingUser();
      switch (persist) {
        case 'never':
          console.log('Not possible to persist storage');
          alert(
            'Your browser does not support permanent persistance. In order to use, please install the latest version of a modern browser.'
          );
          break;
        case 'persisted':
          db.sessions.add(sesh).then(() => {
            state.session = sesh;
            toast.success(`Your session ${sesh.sessionName} has been saved`);
            closeModal();
          });
          break;
        case 'prompt':
          navigator.storage.persist();
          db.sessions.add(sesh).then(() => {
            state.session = sesh;
            toast.success(`Your session ${sesh.sessionName} has been saved`);
            closeModal();
          });
          break;
      }
    }

    initStoragePersistence();
  }

  async function update(e) {
    e.preventDefault();
    setSavingData(true);
    updateSession({
      transactions,
      session,
      sessionName,
      callback: () => {
        toast.success(`Your session ${sessionName} has been updated!`);
        closeModal();
      }
    });
  }

  return (
    <AnimatePresence>
      {sessionModal && (
        <Dialog
          as={motion.div}
          static
          open
          key="session-modal"
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
                  {session ? 'Update' : 'Save'} Session
                </Dialog.Title>
                <Dialog.Description className="text-xs 3xl:text-sm text-gray-500">
                  {session
                    ? 'Update the transaction data or title of the current session.'
                    : "Save current transaction data as a new session. Data will be stored in your browser's integrated database. Everything is stored locally on your computer."}
                </Dialog.Description>

                <div className="my-6 md:my-8">
                  <div className="flex flex-col">
                    <label className="hidden">Session Name</label>
                    <input
                      className="w-full h-[40px] text-sm bg-gray-100e border border-gray-300 hover:border-gray-500 rounded-md px-3"
                      placeholder="Session Name"
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  className="w-full h-14 bg-gray-200 text-xs 3xl:text-sm font-medium text-gray-500 hover:bg-gray-300 hover:text-gray-900 rounded-bl-lg"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="w-full h-14 bg-gray-800 text-xs 3xl:text-sm font-medium text-white hover:bg-gray-700 rounded-br-lg"
                  onClick={(e) => (session ? update(e) : saveSession(e))}
                  disabled={savingData}
                >
                  {session ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
