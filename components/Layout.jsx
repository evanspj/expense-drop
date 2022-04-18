import { useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { state } from '../store';
import { useSnapshot } from 'valtio';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

import Nav from './Nav';
const SessionModal = dynamic(() => import('./SessionModal'));
const NewSessionModal = dynamic(() => import('./NewSessionModal'));
const AddTransactionsModal = dynamic(() => import('./AddTransactionsModal'));
const ExpenseEditModal = dynamic(() => import('./ExpenseEditModal'));
const DownloadModal = dynamic(() => import('./DownloadModal'));
import TailwindBreakpointIndicator from '@components/TailwindBreakpointIndicator';

export default function Layout({ children }) {
  const router = useRouter();
  const { transactions } = useSnapshot(state);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!transactions.length) {
      router.push('/');
      return;
    }
  }, [transactions]);

  if (!transactions.length) return null;

  return (
    <main>
      <Nav />
      {children}
      <SessionModal />
      <NewSessionModal />
      <AddTransactionsModal />
      <ExpenseEditModal />
      <DownloadModal />
      {publicRuntimeConfig.isDev && <TailwindBreakpointIndicator />}
    </main>
  );
}
