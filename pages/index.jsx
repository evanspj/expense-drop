import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ease } from '@utils/animations';
import { Disclosure, Popover } from '@headlessui/react';
import { db, state } from '@store';
import { useSnapshot } from 'valtio';
import * as Fathom from 'fathom-client';

import appPreviewImage from '@images/expense_drop_preview-optimized.png';
import transactionsPreviewImage from '@images/transactions_preview-optimized.png';

import Dropzone from '@components/Dropzone';
import SavedSessionsModal from '@components/SavedSessionsModal';

/**
 *
 * Highlight Component
 *
 **/
function Highlight({ children }) {
  return <span className="text-black">{children}</span>;
}

/**
 *
 * Featured Card Component
 *
 **/
function FeatureCard({ label, icon, description }) {
  return (
    <li className="">
      <p className="flex items-center font-bold text-xl mb-4">
        <span className=" mr-4">{icon}</span>
        {label}
      </p>
      <p className="textLg">{description}</p>
    </li>
  );
}

/**
 *
 * File Header Component
 *
 **/
function FileHeader({ name, description, required }) {
  return (
    <div className="grid grid-cols-4 space-x-6">
      <div className="w-full">
        <p
          className={`inline-flex border  ${
            required
              ? 'bg-black ring-4 ring-gray-200 text-white'
              : 'border-gray-200'
          } rounded-lg font-semibold px-3 py-1`}
        >
          {name}
        </p>
      </div>
      <span className="col-span-3 font-medium text-gray-700 lg:whitespace-nowrap">
        {description} <strong>{required && '(required)'}</strong>
      </span>
    </div>
  );
}

/**
 *
 * FAQ Item Component
 *
 **/
function FAQItem({ question, first, last, children }) {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button
            className={`w-full flex items-center justify-between border-b border-gray-200 font-semibold text-left ${
              first ? 'rounded-t-xl' : ''
            } ${last ? 'rounded-b-xl' : ''} px-6 py-3`}
          >
            {question}
            <span
              style={{ transform: `rotate(${open ? '0deg' : '180deg'})` }}
              className="ml-5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
              >
                <g fill="currentColor">
                  <path
                    d="M22,6.5a1.5,1.5,0,0,0-1.061.439L12,15.879,3.061,6.939A1.5,1.5,0,0,0,.939,9.061l10,10a1.5,1.5,0,0,0,2.122,0l10-10A1.5,1.5,0,0,0,22,6.5Z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
            </span>
          </Disclosure.Button>
          <Disclosure.Panel className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 textLeft p-6">
            {children}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

/**
 *
 * Icon Components
 *
 **/

function OrganizeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20"
      width="20"
      viewBox="0 0 24 24"
      role="img"
      aria-labelledby="drawer-icon"
    >
      <title id="drawer-icon">Drawer Icon</title>
      <g fill="currentColor">
        <path d="M22 8H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1Zm-5 7a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-3h2v2h6v-2h2Z" />
        <path d="M4 4h16v2H4zM7 0h10v2H7z" />
      </g>
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      role="img"
      aria-labelledby="save-icon"
    >
      <title id="save-icon">Save Icon</title>
      <g fill="currentColor">
        <path
          d="M22.707,6.707,17.293,1.293A1,1,0,0,0,16.586,1H4A3,3,0,0,0,1,4V20a3,3,0,0,0,3,3H20a3,3,0,0,0,3-3V7.414A1,1,0,0,0,22.707,6.707ZM14.5,4h1a.5.5,0,0,1,.5.5v4a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5v-4A.5.5,0,0,1,14.5,4ZM19,12.5v6a.5.5,0,0,1-.5.5H5.5a.5.5,0,0,1-.5-.5v-6a.5.5,0,0,1,.5-.5h13A.5.5,0,0,1,19,12.5Z"
          fill="currentColor"
        ></path>
      </g>
    </svg>
  );
}

function MinimalIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20"
      width="20"
      viewBox="0 0 24 24"
      role="img"
      aria-labelledby="layout-icon"
    >
      <title id="layout-icon">Layout Icon</title>
      <g fill="currentColor">
        <path d="M23 6V4a3 3 0 0 0-3-3H4a3 3 0 0 0-3 3v2Z" />
        <path d="M1 8v12a3 3 0 0 0 3 3h3V8ZM9 23h11a3 3 0 0 0 3-3V8H9Z" />
      </g>
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20"
      width="20"
      viewBox="0 0 24 24"
      role="img"
      aria-labelledby="chart-icon"
    >
      <title id="chart-icon">Chart Icon</title>
      <g fill="currentColor">
        <path d="M14 2h-4a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
        <path d="M5 13H1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1zM23 8h-4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z" />
      </g>
    </svg>
  );
}

function PrivacyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20"
      width="20"
      viewBox="0 0 24 24"
      role="img"
      aria-labelledby="privacy-icon"
    >
      <title id="privacy-icon">Privacy Icon</title>
      <g fill="currentColor">
        <path d="M0 13h24l-5-4H5l-5 4z" />
        <path d="M17.5 14a4.484 4.484 0 0 0-3.911 2.318 4.506 4.506 0 0 0-3.178 0A4.465 4.465 0 1 0 11 18.5c0-.089-.021-.172-.026-.26a2.467 2.467 0 0 1 2.052 0c0 .088-.026.171-.026.26a4.5 4.5 0 1 0 4.5-4.5Zm-11 7A2.5 2.5 0 1 1 9 18.5 2.5 2.5 0 0 1 6.5 21Zm11 0a2.5 2.5 0 1 1 2.5-2.5 2.5 2.5 0 0 1-2.5 2.5Z" />
        <path d="m18.5 7-1.311-5.243a1 1 0 0 0-.97-.757H7.781a1 1 0 0 0-.97.757L5.5 7Z" />
      </g>
    </svg>
  );
}

function InsightsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20"
      width="20"
      viewBox="0 0 24 24"
      role="img"
      aria-labelledby="insights-icon"
    >
      <title id="insights-icon">Insights Icon</title>
      <g fill="currentColor">
        <path d="M1 10h7a1 1 0 0 0 0-2H1a1 1 0 1 0 0 2zM1 16h7a1 1 0 0 0 0-2H1a1 1 0 1 0 0 2zM16 20H1a1 1 0 1 0 0 2h15a1 1 0 1 0 0-2zM1 4h15a1 1 0 1 0 0-2H1a1 1 0 1 0 0 2z" />
        <path d="m23.707 18.293-3.54-3.54A4.969 4.969 0 0 0 21 12c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5a4.969 4.969 0 0 0 2.753-.833l3.54 3.54a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414zM16 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
      </g>
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      role="img"
      aria-labelledby="download-icon"
    >
      <title id="download-icon">Download Icon</title>
      <g fill="currentColor">
        <polygon points="6,10 12,17 18,10 13,10 13,1 11,1 11,10 "></polygon>{' '}
        <path
          fill="currentColor"
          d="M22,21H2v-6H0v7c0,0.552,0.448,1,1,1h22c0.552,0,1-0.448,1-1v-7h-2V21z"
        ></path>
      </g>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      role="img"
      aria-labelledby="edit-icon"
    >
      <title id="edit-icon">Edit Icon</title>
      <g fill="currentColor">
        <path
          d="M22.707,5.293l-4-4a1,1,0,0,0-1.414,0l-14,14a.974.974,0,0,0-.241.391l-2,6A1,1,0,0,0,2,23a.987.987,0,0,0,.316-.052l6-2a1,1,0,0,0,.391-.241l14-14A1,1,0,0,0,22.707,5.293Z"
          fill="currentColor"
        ></path>
      </g>
    </svg>
  );
}

/**
 *
 * Mobile Nav Component
 *
 **/
function MobileNav({ isLoadingSessions, sessions, setIsSavedSessionsOpen }) {
  return (
    <nav className="lg:hidden w-full sticky top-0 left-0 right-0 flex justify-end items-center py-3 z-30">
      <Popover className="relative">
        {({ open, close }) => (
          <AnimatePresence>
            <Popover.Button
              key="mobile-menu"
              className="relative border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 z-40"
            >
              {open ? (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-labelledby="close-icon"
                >
                  <title id="close-icon">Close Menu</title>
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
                  aria-labelledby="menu-icon"
                >
                  <title id="menu-icon">Open Menu</title>
                  <path
                    d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </Popover.Button>
            <Popover.Panel
              key="nav-content"
              as={motion.div}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ ease, duration: 0.3 }}
              className="absolute top-[120%] right-0 min-w-[180px] bg-gray-100 rounded-lg shadow-xl border border-gray-200 overflow-hidden p-1 Z-40"
            >
              <div className="w-full whitespace-nowrap">
                <a
                  href="#features"
                  onClick={close}
                  className="block w-full hover:bg-black hover:text-white rounded-md font-medium px-4 py-2"
                >
                  Features
                </a>
                <a
                  href="#file-format"
                  onClick={close}
                  className="block w-full hover:bg-black hover:text-white rounded-md font-medium px-4 py-2"
                >
                  File Format
                </a>
                <a
                  href="#faq"
                  onClick={close}
                  className="block w-full hover:bg-black hover:text-white rounded-md font-medium px-4 py-2"
                >
                  FAQ
                </a>
                <a
                  href="https://github.com/evanspj/expense-drop"
                  onClick={close}
                  className="flex items-center w-full hover:bg-black hover:text-white rounded-md font-medium px-4 py-2"
                >
                  Github
                  <span className="ml-2">
                    <svg
                      className="-rotate-45"
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      aria-labelledby="mobile-external-arrow"
                    >
                      <title id="mobile-external-arrow">
                        Project Github Page Link
                      </title>
                      <g
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <line
                          x1="2"
                          y1="12"
                          x2="22"
                          y2="12"
                          stroke="currentColor"
                        ></line>{' '}
                        <polyline points="15,5 22,12 15,19 "></polyline>
                      </g>
                    </svg>
                  </span>
                </a>
                {!isLoadingSessions && sessions?.length ? (
                  <button
                    onClick={() => {
                      setIsSavedSessionsOpen(true);
                      close();
                    }}
                    className="w-full text-left font-semibold bg-white hover:bg-black hover:text-white rounded-md px-4 py-2 Z-40"
                  >
                    Saved Sessions
                  </button>
                ) : null}
              </div>
            </Popover.Panel>
          </AnimatePresence>
        )}
      </Popover>
    </nav>
  );
}

/**
 *
 * Save Session Button Component
 *
 **/
function SavedSessionsButton({ hasSessions, openModal, large }) {
  if (!hasSessions) return null;

  return (
    <button
      onClick={openModal}
      className={`inline-flex items-center bg-gray-200 hover:bg-gray-300 ${
        large
          ? 'font-medium rounded-lg px-5 py-3'
          : 'text-sm font-semibold rounded-md px-3 py-2'
      }`}
    >
      Saved Sessions
    </button>
  );
}

/**
 *
 * Desktop Nav Link Component
 *
 **/
function DesktopNavLink({ href, children }) {
  return (
    <a
      href={href}
      className="inline-flex items-center hover:bg-gray-100 rounded-md font-medium px-2 py-1"
    >
      {children}
    </a>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [isSavedSessionsOpen, setIsSavedSessionsOpen] = useState(false);
  const [sessions, setSessions] = useState(null);
  const [isLoadingSessions, seIstLoadingSessions] = useState(true);
  const { transactions } = useSnapshot(state);

  function fetchSessions() {
    db.sessions.toArray().then((res) => {
      setSessions(
        res.sort((a, b) => new Date(b.modified) - new Date(a.modified))
      );
      seIstLoadingSessions(false);
    });
  }

  async function startDemo() {
    const data = await import('@data/demo-data.json').then(
      (module) => module.data
    );
    state.transactions = data.map((t, i) => ({ ...t, __rowNum__: i }));
  }

  function enableLoading() {
    seIstLoadingSessions(true);
  }

  function closeSavedSessionModal() {
    setIsSavedSessionsOpen(false);
  }

  useEffect(() => {
    fetchSessions();
    if (process.env.NODE_ENV === 'production') {
      Fathom.load(process.env.NEXT_PUBLIC_FATHOM_SITE_ID, {
        includedDomains: ['expense-drop.vercel.app']
      });
    }
  }, []);

  useEffect(() => {
    if (transactions?.length) {
      router.push('/app');
      return;
    }
  }, [transactions]);

  return (
    <main className="bg-white px-6 lg:px-10 2xl:px-0">
      <Head>
        <title>Expense Drop</title>
      </Head>
      <nav className="hidden sticky top-0 lg:flex items-center h-[80px] bg-white z-40">
        <div className="flex justify-end items-center w-full max-w-screen-xl mx-auto space-x-4">
          <DesktopNavLink href="#features">Features</DesktopNavLink>
          <DesktopNavLink href="#file-format">File Format</DesktopNavLink>
          <DesktopNavLink href="#faq">FAQ</DesktopNavLink>
          <DesktopNavLink href="https://github.com/evanspj/expense-drop">
            Github{' '}
            <span className="ml-2">
              <svg
                className="-rotate-45"
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                aria-labelledby="external-arrow"
              >
                <title id="external-arrow">Project Github Page Link</title>
                <g
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <line
                    x1="2"
                    y1="12"
                    x2="22"
                    y2="12"
                    stroke="currentColor"
                  ></line>{' '}
                  <polyline points="15,5 22,12 15,19 "></polyline>
                </g>
              </svg>
            </span>
          </DesktopNavLink>
          <SavedSessionsButton
            hasSessions={!isLoadingSessions && sessions?.length}
            openModal={() => setIsSavedSessionsOpen(true)}
          />
        </div>
      </nav>
      <MobileNav
        isLoadingSessions={isLoadingSessions}
        sessions={sessions}
        setIsSavedSessionsOpen={setIsSavedSessionsOpen}
      />
      <div className="pt-20 pb-10 lg:py-10">
        <section className="lg:flex max-w-screen-xl mx-auto">
          <div className="w-full lg:w-1/2">
            <h1 className="w-full text-5xl 3xl:text-6xl font-extrabold pb-10 pr-10 3xl:pb-20 3xl:pr-20">
              Analyze your expenses at the drop of a file.
            </h1>
            <p className="w-full text-2xl text-gray-500 font-semibold">
              A <Highlight>privacy-focused</Highlight> way to review your
              expenses. All file processing and{' '}
              <Highlight>data stays in your browser</Highlight>. No data is
              stored on a server. Your important financial data should be for{' '}
              <Highlight>your eyes only</Highlight>.
            </p>
            <div className="flex items-center space-x-4 mt-10">
              <button
                onClick={startDemo}
                className="bg-black text-white font-medium rounded-lg hover:bg-black/80 px-5 py-3"
              >
                Try Demo
              </button>
              <SavedSessionsButton
                large
                hasSessions={!isLoadingSessions && sessions?.length}
                openModal={() => setIsSavedSessionsOpen(true)}
              />
            </div>
          </div>
          <div className="w-full h-80 lg:h-auto lg:w-1/2 pt-20 lg:pt-0 lg:pl-20">
            <Dropzone />
          </div>
        </section>
        <section id="features" className="max-w-screen-xl mx-auto mt-32">
          <div className="relative border-2 border-black rounded-xl shadow-xl leading-none mb-10">
            <Image
              className="z-10 leading-none rounded-xl"
              src={appPreviewImage}
              placeholder="blur"
              alt="Expense Drop App Preview"
            />
          </div>
          <ul className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-20 lg:px-8 mt-16 lg:mt-32">
            <FeatureCard
              label="Privacy"
              icon={<PrivacyIcon />}
              description="By having everything done in the browser you can rest assured that your data stays on your device"
            />
            <FeatureCard
              label="Organize"
              icon={<OrganizeIcon />}
              description="Your expenses will automatically be organized by account type, month and category"
            />
            <FeatureCard
              label="Visualize"
              icon={<ChartIcon />}
              description="Beautiful charts will help you visualize your data"
            />
            <FeatureCard
              label="Minimal Design"
              icon={<MinimalIcon />}
              description="With the minimalist design you're able to focus on what’s important"
            />
            <FeatureCard
              label="Insights"
              icon={<InsightsIcon />}
              description="Once your data is analyzed and processed, you will quickly be able to pinpoint notable changes to your spending"
            />
            <FeatureCard
              label="Save For Later"
              icon={<SaveIcon />}
              description="Save your transactions (encrypted) to your browsers storage to view again later"
            />
            <FeatureCard
              label="Edit"
              icon={<EditIcon />}
              description="Make edits to your transactions after your initial file upload"
            />
            <FeatureCard
              label="Download"
              icon={<DownloadIcon />}
              description="Download your transactions to an excel file to use with the app at another time or save for your records"
            />
          </ul>
        </section>
        <section
          id="file-format"
          className="max-w-screen-xl mx-auto mt-20 lg:mt-40"
        >
          <div className="relative border-2 border-black rounded-xl shadow-xl leading-none mb-10">
            <Image
              className="z-10 leading-none rounded-xl"
              src={transactionsPreviewImage}
              placeholder="blur"
              alt="Transactions Page Preview"
            />
          </div>
          <div>
            <div className="lg:grid lg:grid-cols-2 mt-16 lg:mt-32">
              <div className="w-full">
                <p className="lg:text-lg font-medium">
                  For the app to work correctly, there is a specific format that
                  is required for the excel file. The app expects the first row
                  of the file to contain the headers for each column. The order
                  of the columns does not matter, but the app will pull data
                  from the headers <strong>date</strong>,{' '}
                  <strong>description</strong>, <strong>account</strong>,{' '}
                  <strong>category</strong>, and <strong>amount</strong>{' '}
                  columns. Any other columns you have in your file will be
                  ignored. An error will be displayed if you try to upload a
                  file with them missing.{' '}
                  <strong>Column headers need to be capitalized.</strong>
                </p>
                <p className="mt-10 font-medium">
                  <strong>NOTE:</strong> Though these headers are not required,
                  if either the &quot;Account&quot; or &quot;Category&quot;
                  value is left blank, it will affect how the data is presented.
                  Ideally, you want to make sure all cell values are filled in.
                </p>
              </div>
              <div className="flex lg:justify-end mt-20 lg:mt-0">
                <div className="shrink  space-y-3">
                  <FileHeader
                    required
                    name="Date"
                    description="The date of the transaction"
                  />
                  <FileHeader
                    name="Description"
                    description="Transaction name or description"
                  />
                  <FileHeader
                    name="Account"
                    description="Account of the transaction"
                  />
                  <FileHeader
                    name="Category"
                    description="Category of the transaction"
                  />
                  <FileHeader
                    required
                    name="Amount"
                    description="Amount of the transaction"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="max-w-screen-xl mx-auto mt-20 lg:mt-40">
          <div className="h-80">
            <Dropzone />
          </div>
          <div className="flex items-center space-x-4 mt-10">
            <button
              onClick={startDemo}
              className="bg-black text-white font-medium rounded-lg hover:bg-black/80 px-5 py-3"
            >
              Try Demo
            </button>
            <SavedSessionsButton
              large
              hasSessions={!isLoadingSessions && sessions?.length}
              openModal={() => setIsSavedSessionsOpen(true)}
            />
          </div>
        </section>
        <section id="faq" className="max-w-screen-xl mx-auto mt-20 lg:mt-40">
          <h2 className="font-bold text-2xl mb-10">FAQ</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <FAQItem first question="Why doesn't this app do ...?">
              This app is intentionally limited in scope to solely focus on
              analyzing a file of expenses formatted in the way described in the{' '}
              <a href="#file-format" className="text-black font-bold underline">
                File Format
              </a>{' '}
              section. This is not intended to be a wealth management app,
              investment tracker, nor full-feature finance app.
            </FAQItem>
            <FAQItem question="Why aren't my expenses being organized by account or category?">
              Be sure that you have information inputted for these columns on
              your expenses. By default, if your excel file has either the
              account or category column left blank, then it will default to “No
              Account” and “Uncategorized,” respectively. Ideally, you would
              have all of the information filled in the excel file; however, in
              the event you did not, you can still edit each expense in the app
              to modify all field types.
            </FAQItem>
            <FAQItem question="Why doesn't the app figure out what each expense category is and automatically populate it?">
              This is outside the scope of the app, which requires you to
              manually add the correct information. Luckily, many banks include
              a category column when you download your transactions.
            </FAQItem>
            <FAQItem question="Why when I do a hard refresh of the page does it brings me back to the landing page?">
              Since the app is functioning completely in the browser, it does
              not automatically save your data to an external database and
              therefore does not permanently store the data. This guarantees
              that your data never leaves your browser and is kept private.
              While using the app, your data is saved in a temporary in-memory
              storage, allowing you to interact with the app and navigate
              between pages while temporarily saving your data. Once you do a
              hard refresh, that in-memory storage is reset and therefore you
              are sent back to the landing page.
            </FAQItem>
            <FAQItem question="I saved my session to the browser storage but it is not appearing on the landing page.">
              This app allows you to save your data (referred to as a session)
              to your browser in order to access it again at a later time. There
              are some limitations with this given the way that browser storage
              works.
              <br />
              <br />
              If you clear your cache or delete and reinstall your browser, then
              the saved data will be removed and is not recoverable. You are
              able to download your sessions, so be sure to do so before doing
              any of these actions. Then you can re-upload that file to get your
              session back.
              <br />
              <br />
              If you view the app in your browser&apos;s private mode, the saved
              sessions will not appear because private mode functions as a
              completely isolated browser session.
              <br />
              <br />
              If you use a different browser, the data will not be available
              because all saved data is specific to your browser&apos;s session.
            </FAQItem>
            <FAQItem
              last
              question="I want to be able to store my data in a database so that it is permanently stored."
            >
              Since the aim of this project is to be privacy-focused and only
              allow for an in-browser experience, this function is not
              available. However, since this project is open-source, you can
              easily fork it&apos;s repo (link to github) and modify the
              in-browser persistant storage code to instead connect to a
              database like{' '}
              <a
                href="https://supabase.com"
                className="text-black font-bold underline"
              >
                Supabase
              </a>
              ,{' '}
              <a
                href="https://firebase.google.com"
                className="text-black font-bold underline"
              >
                Firebase
              </a>{' '}
              , or{' '}
              <a
                href="https://planetscale.com"
                className="text-black font-bold underline"
              >
                Planetscale
              </a>{' '}
              and self-host. If you decide to go this route, then I would
              suggest also implementing some form of user authentication to
              protect your data from being accessed.
            </FAQItem>
          </div>
        </section>
      </div>
      <footer className="flex justify-center space-x-2 text-xs xl:text-sm font-medium pt-20 pb-6">
        <p>
          Designed & Developed by{' '}
          <a href="https://evanspj.com" className="underline cursor-pointer">
            Patrick Evans
          </a>
        </p>
        <span>|</span>
        <a
          href="https://github.com/evanspj/expense-drop/blob/main/LICENSE"
          className="underline cursor-pointer"
        >
          MIT License
        </a>
      </footer>
      {sessions?.length ? (
        <SavedSessionsModal
          sessions={sessions}
          isOpen={isSavedSessionsOpen}
          close={closeSavedSessionModal}
          enableLoading={enableLoading}
          fetchSessions={fetchSessions}
        />
      ) : null}
    </main>
  );
}
