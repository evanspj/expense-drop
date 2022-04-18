import Head from 'next/head';
import { state } from '@store';
import { useSnapshot } from 'valtio';
import { formatArray } from '@utils/helpers';

import Layout from '@components/Layout';
import ExpensesList from '@components/ExpensesList';

export default function Transactions() {
  const { transactions } = useSnapshot(state);

  return (
    <div className="w-full max-w-screen-3xl lg:px-4 mx-auto mt-[63px]">
      <Head>
        <title>Expense Drop - Transactions</title>
      </Head>
      <ExpensesList expenses={formatArray(transactions)} />
    </div>
  );
}

Transactions.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
