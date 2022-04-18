import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ease } from '@utils/animations';
import { db, state } from '@store';
import { decryptData } from '@utils/helpers';

import DeleteSessionsConfirmationModal from '@components/DeleteSessionConfirmationModal';

function SettingButton({ isOpen, activateEditing, deactivateEditing }) {
  return (
    <button
      onClick={isOpen ? deactivateEditing : activateEditing}
      className="bg-gray-100 text-gray-500 hover:bg-black hover:text-white border border-gray-200 hover:border-black rounded-md p-2"
    >
      {isOpen ? (
        <p className="text-xs">Cancel</p>
      ) : (
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      )}
    </button>
  );
}

export default function SavedSessions({
  sessions,
  isOpen,
  close,
  enableLoading,
  fetchSessions
}) {
  const [shouldEditSessions, setShouldEditSessions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState([]);

  const loadSessionText =
    sessions?.length > 1
      ? `Click on one of the below ${sessions.length} session cards to load that session.`
      : 'Click on the below session card to load that session.';

  async function startSession(session) {
    const decryptedData = await decryptData(session.transactions);
    state.transactions = decryptedData;
    state.session = session;
  }

  function activateEditing() {
    setShouldEditSessions(true);
  }

  function deactivateEditing() {
    setShouldEditSessions(false);
    setItemsToDelete([]);
  }

  function handleCheckbox(e, session) {
    if (e.target.checked) {
      setItemsToDelete([...itemsToDelete, session]);
    } else {
      setItemsToDelete(itemsToDelete.filter((item) => item.id !== session.id));
    }
  }

  function openDeleteModal() {
    setShowDeleteModal(true);
  }

  function closeDeleteModal() {
    setShowDeleteModal(false);
  }

  async function deleteSessions() {
    db.sessions.bulkDelete(itemsToDelete.map((item) => item.id)).then((res) => {
      setShouldEditSessions(false);
      setItemsToDelete([]);
      enableLoading();
      fetchSessions();
      toast.success('Sessions have been deleted.');
    });
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Dialog
            as={motion.div}
            static
            open
            onClose={close}
            key="saved-sessions-modal"
            className="fixed inset-0 flex justify-center items-end lg:items-center z-40"
          >
            <Dialog.Overlay
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease, duration: 0.1 }}
              className="firefox:bg-black/50 bg-black/20 backdrop-blur-sm fixed inset-0 z-30"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ ease, duration: 0.2 }}
              className="relative w-full lg:w-[500px] bg-white rounded-t-xl lg:rounded-lg  px-6 pt-6 pb-20 lg:p-6 z-30"
            >
              <div className="flex justify-between items-center">
                <Dialog.Title className="text-xl 3xl:text-2xl font-bold pb-2">
                  Saved Sessions
                </Dialog.Title>
                <div className="flex items-center space-x-2">
                  {sessions?.length ? (
                    <SettingButton
                      isOpen={shouldEditSessions}
                      activateEditing={activateEditing}
                      deactivateEditing={deactivateEditing}
                    />
                  ) : null}
                  <button
                    onClick={close}
                    className="bg-gray-100 text-gray-500 hover:bg-black hover:text-white border border-gray-200 hover:border-black rounded-md p-2"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="h-full">
                <Dialog.Description className="w-full max-w-[70%] text-xs 3xl:text-sm text-gray-500 pb-6">
                  {shouldEditSessions
                    ? 'Select the sessions you would like to delete.'
                    : loadSessionText}
                </Dialog.Description>
                <div className="w-full space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`w-full flex items-center bg-gray-100 rounded-md ${
                        shouldEditSessions
                          ? 'cursor-default'
                          : 'hover:bg-black hover:text-white'
                      }`}
                    >
                      {shouldEditSessions && (
                        <div className="flex items-center justify-center pl-3">
                          <input
                            type="checkbox"
                            id={`session-${session.id}`}
                            name="deleteSessions[]"
                            onChange={(e) => handleCheckbox(e, session)}
                            className="appearance-none h-4 w-4 border border-gray-300 rounded text-black hover:border-black checked:bg-black checked:ring-2 checked:ring-offset-1 checked:ring-black  cursor-pointer"
                          />
                        </div>
                      )}
                      <button
                        className={`w-full h-full flex justify-between items-center rounded-md ${
                          shouldEditSessions
                            ? 'cursor-default'
                            : 'cursor-pointer'
                        } px-4 py-3`}
                        onClick={() => startSession(session)}
                        disabled={shouldEditSessions}
                      >
                        <div className="text-left">
                          <p className="text-sm font-medium">
                            {session.sessionName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs 3xl:text-sm">
                            {new Intl.DateTimeFormat('en-US').format(
                              session.modified
                            )}
                          </p>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
                <AnimatePresence>
                  {itemsToDelete.length ? (
                    <motion.div
                      key="delete-button"
                      className="absolute bottom-2 right-2 bg-white shadow-md"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{
                        duration: 0.2,
                        ease: [0.175, 0.85, 0.42, 0.96]
                      }}
                    >
                      <button
                        className="text-sm 3xl:text-base bg-red-500 text-white rounded px-3 py-2"
                        onClick={openDeleteModal}
                      >
                        Delete Sessions
                      </button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>
            <DeleteSessionsConfirmationModal
              multipleSessions={itemsToDelete.length > 1}
              deleteSessions={deleteSessions}
              showDeleteModal={showDeleteModal}
              closeDeleteModal={closeDeleteModal}
            />
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
