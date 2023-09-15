import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuVariants } from '@utils/animations';
import { state, db } from '@store';
import { useSnapshot } from 'valtio';

import DeleteSessionsConfirmationModal from '@components/DeleteSessionConfirmationModal';
import Tooltip from '@components/Tooltip';

export default function NavMenu() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();
  const { session } = useSnapshot(state);

  function openDeleteModal() {
    setShowDeleteModal(true);
  }
  function hideDeleteModal() {
    setShowDeleteModal(false);
  }
  function deleteSession() {
    db.sessions.delete(session.id).then(() => {
      state.transactions = [];
      state.session = null;
      router.push('/');
    });
  }

  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => (
          <>
            <div>
              <Tooltip label="Menu" dark>
                <Menu.Button className="flex justify-center items-center bg-white border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white rounded-md px-3 py-2">
                  {open ? (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-labelledby="main-menu-close"
                    >
                      <title id="main-menu-close">Close Menu</title>
                      <path
                        d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-labelledby="main-menu-open"
                    >
                      <title id="main-menu-open">Open Menu</title>
                      <path
                        d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  )}
                </Menu.Button>
              </Tooltip>
            </div>
            <AnimatePresence>
              {open && (
                <Menu.Items
                  as={motion.div}
                  key="menu-modal"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={menuVariants}
                  className="absolute min-w-[180px] right-0 mt-2 origin-top-right border border-gray-200 bg-white divide-y divide-gray-200 rounded-lg shadow-xl focus:outline-none"
                >
                  {router.pathname !== '/app/transactions' && (
                    <div className="p-1">
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            className={`${
                              active ? 'bg-black text-white' : 'text-black'
                            } flex rounded-md items-center w-full px-2 py-2 text-xs 3xl:text-sm cursor-pointer`}
                          >
                            <Link href="/app/transactions" className="w-full h-full flex items-center">
                                <svg
                                  className="mr-2"
                                  width="15"
                                  height="15"
                                  viewBox="0 0 15 15"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  role="img"
                                  aria-labelledby="transactions-link"
                                >
                                  <title id="transactions-link">
                                    Go to Transactions Page
                                  </title>
                                  <path
                                    d="M2 3.5C2 3.22386 2.22386 3 2.5 3H12.5C12.7761 3 13 3.22386 13 3.5V9.5C13 9.77614 12.7761 10 12.5 10H2.5C2.22386 10 2 9.77614 2 9.5V3.5ZM2 10.9146C1.4174 10.7087 1 10.1531 1 9.5V3.5C1 2.67157 1.67157 2 2.5 2H12.5C13.3284 2 14 2.67157 14 3.5V9.5C14 10.1531 13.5826 10.7087 13 10.9146V11.5C13 12.3284 12.3284 13 11.5 13H3.5C2.67157 13 2 12.3284 2 11.5V10.9146ZM12 11V11.5C12 11.7761 11.7761 12 11.5 12H3.5C3.22386 12 3 11.7761 3 11.5V11H12Z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                                All Transactions
                            </Link>
                          </div>
                        )}
                      </Menu.Item>
                    </div>
                  )}
                  <div className="p-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => (state.addTransactionsModal = true)}
                          className={`${
                            active ? 'bg-black text-white' : 'text-black'
                          } flex rounded-md items-center w-full px-2 py-2 text-xs 3xl:text-sm cursor-pointer`}
                        >
                          <svg
                            className="mr-2"
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            aria-labelledby="add-transactions-button"
                          >
                            <title id="add-transactions-button">
                              Add Transactions
                            </title>
                            <path
                              d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          Add Transactions
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => (state.newSessionModal = true)}
                          className={`${
                            active ? 'bg-black text-white' : 'text-black'
                          } flex rounded-md items-center w-full px-2 py-2 text-xs 3xl:text-sm focus:outline-none cursor-pointer`}
                        >
                          <svg
                            className="mr-2"
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            aria-labelledby="new-sessions-button"
                          >
                            <title id="new-sessions-button">New Session</title>
                            <path
                              d="M3.5 2C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V4.70711L9.29289 2H3.5ZM2 2.5C2 1.67157 2.67157 1 3.5 1H9.5C9.63261 1 9.75979 1.05268 9.85355 1.14645L12.7803 4.07322C12.921 4.21388 13 4.40464 13 4.60355V12.5C13 13.3284 12.3284 14 11.5 14H3.5C2.67157 14 2 13.3284 2 12.5V2.5ZM4.75 7.5C4.75 7.22386 4.97386 7 5.25 7H7V5.25C7 4.97386 7.22386 4.75 7.5 4.75C7.77614 4.75 8 4.97386 8 5.25V7H9.75C10.0261 7 10.25 7.22386 10.25 7.5C10.25 7.77614 10.0261 8 9.75 8H8V9.75C8 10.0261 7.77614 10.25 7.5 10.25C7.22386 10.25 7 10.0261 7 9.75V8H5.25C4.97386 8 4.75 7.77614 4.75 7.5Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          New Session
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-black text-white' : 'text-black'
                          } flex rounded-md items-center w-full space-x-2 px-2 py-2 text-xs 3xl:text-sm focus:outline-none cursor-pointer`}
                          onClick={() => (state.sessionModal = true)}
                        >
                          <svg
                            className="mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            role="img"
                            aria-labelledby="save-session-button"
                          >
                            <title id="save-session-button">
                              {session ? 'Update' : 'Save'} Session
                            </title>
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                          </svg>
                          {session ? 'Update' : 'Save'} Session
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-black text-white' : 'text-black'
                          } flex rounded-md items-center w-full space-x-2 px-2 py-2 text-xs 3xl:text-sm focus:outline-none cursor-pointer`}
                          onClick={() => (state.downloadModal = true)}
                        >
                          <svg
                            className="mr-2"
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            aria-labelledby="download-button"
                          >
                            <title id="download-button">
                              Download Transactions
                            </title>
                            <path
                              d="M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999ZM2.5 10C2.77614 10 3 10.2239 3 10.5V12C3 12.5539 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V12C13 13.1041 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2239 2.22386 10 2.5 10Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          Download
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  {session && (
                    <div className="p-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={openDeleteModal}
                            className={`${
                              active
                                ? 'bg-red-600 text-white'
                                : 'bg-red-500 text-white'
                            } flex rounded-md items-center w-full px-2 py-2 text-xs 3xl:text-sm focus:outline-none cursor-pointer`}
                          >
                            <svg
                              className="mr-2"
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              role="img"
                              aria-labelledby="delete-session-button"
                            >
                              <title id="delete-session-button">
                                Delete Session
                              </title>
                              <path
                                d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            Delete Session
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  )}
                </Menu.Items>
              )}
            </AnimatePresence>
          </>
        )}
      </Menu>
      <DeleteSessionsConfirmationModal
        showDeleteModal={showDeleteModal}
        deleteSessions={deleteSession}
        hideDeleteModal={hideDeleteModal}
      />
    </div>
  );
}
