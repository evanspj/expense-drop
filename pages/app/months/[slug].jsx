import { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { state } from '@store';
import { useSnapshot } from 'valtio';
import {
  getTransactions,
  setMonth,
  calcSpendingTrend,
  formatArray
} from '@utils/helpers';

import Layout from '@components/Layout';
import HeaderStats from '@components/HeaderStats';
import ExpensesList from '@components/ExpensesList';
import SectionWrapper from '@components/SectionWrapper';
import BarChartCard from '@components/BarChartCard';
import CardList from '@components/CardList';

export default function MonthDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const { months, transactions } = useSnapshot(state);
  const currentMonth = useMemo(
    () => months.filter((month) => month.name === slug)[0],
    [months, slug]
  );
  const byAccounts = useMemo(
    () =>
      getTransactions(currentMonth?.transactions, 'Account').sort(
        (a, b) => b.sum - a.sum
      ),
    [currentMonth]
  );
  const byCategories = useMemo(
    () =>
      getTransactions(currentMonth?.transactions, 'Category').sort(
        (a, b) => b.sum - a.sum
      ),
    [currentMonth]
  );

  if (!currentMonth) {
    router.push('/');
    return null;
  }

  return (
    <div className="w-full pb-10 max-w-screen-3xl mx-auto mt-[63px]">
      <Head>
        <title>Expense Drop - {setMonth(currentMonth?.name)}</title>
      </Head>
      <header className="flex flex-col items-center justify-center px-4 lg:px-0">
        <h1 className="text-lg 2xl:text-2xl capitalize font-bold mb-6">
          {setMonth(slug)}
        </h1>
        <HeaderStats
          transactions={formatArray(transactions)}
          totalExpenses={currentMonth?.sum}
          transactionsQuantity={currentMonth?.transactions.length}
          spendingTrend={calcSpendingTrend(currentMonth.index, months)}
        />
      </header>
      <div className="space-y-20 mt-10">
        <SectionWrapper sectionLabel="By Account" detailPage>
          <BarChartCard
            data={byAccounts.map((account) => ({
              x: account.name,
              y: account.sum
            }))}
            totalExpenses={currentMonth?.sum}
            detailPage
          />
          <CardList
            data={byAccounts}
            detailPage
            percentage
            totalSum={currentMonth.sum}
          />
        </SectionWrapper>
        <SectionWrapper sectionLabel="By Category" detailPage>
          <BarChartCard
            data={byCategories.map((category) => ({
              x: category.name,
              y: category.sum
            }))}
            totalExpenses={currentMonth?.sum}
            detailPage
          />
          <CardList
            data={byCategories}
            detailPage
            percentage
            totalSum={currentMonth.sum}
          />
        </SectionWrapper>
        <section className="lg:px-4">
          <ExpensesList
            label={setMonth(currentMonth?.name)}
            expenses={formatArray(currentMonth?.transactions)}
          />
        </section>
      </div>
    </div>
  );
}

MonthDetail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
