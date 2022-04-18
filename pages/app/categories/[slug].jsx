import { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { state } from '@store';
import { useSnapshot } from 'valtio';
import {
  getTransactions,
  calcMonthlyAverage,
  setMonth,
  nameToSlug,
  formatArray
} from '@utils/helpers';

import Layout from '@components/Layout';
import HeaderStats from '@components/HeaderStats';
import ExpensesList from '@components/ExpensesList';
import SectionWrapper from '@components/SectionWrapper';
import BarChartCard from '@components/BarChartCard';
import CardList from '@components/CardList';
import ByMonthLabel from '@components/ByMonthLabel';

export default function CategoryDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const { categories, transactions } = useSnapshot(state);
  const currentCategory = useMemo(
    () =>
      categories.filter(
        (category) =>
          nameToSlug(
            category.name === 'undefined' ? 'Uncategorized' : category.name
          ) === slug
      )[0],
    [categories, slug]
  );
  const byAccounts = useMemo(
    () =>
      getTransactions(currentCategory?.transactions, 'Account').sort(
        (a, b) => b.sum - a.sum
      ),
    [currentCategory]
  );
  const byMonths = useMemo(
    () => getTransactions(currentCategory?.transactions, 'Month'),
    [currentCategory]
  );
  const monthlyAverage = useMemo(
    () => calcMonthlyAverage(byMonths),
    [byMonths]
  );

  if (!currentCategory) {
    router.push('/');
    return null;
  }

  return (
    <>
      <div className="w-full pb-10 max-w-screen-3xl mx-auto mt-[63px]">
        <Head>
          <title>Expense Drop - {currentCategory?.name}</title>
        </Head>
        <header className="flex flex-col items-center justify-center px-4 lg:px-0">
          <h1 className="text-lg 2xl:text-2xl capitalize font-bold mb-6">
            {slug.split('-').join(' ')}
          </h1>
          <HeaderStats
            transactions={formatArray(transactions)}
            totalExpenses={currentCategory?.sum}
            transactionsQuantity={currentCategory?.transactions.length}
          />
        </header>
        <div className="space-y-20 mt-10">
          <SectionWrapper sectionLabel="By Account" detailPage>
            <BarChartCard
              data={byAccounts.map((account) => ({
                x: account.name,
                y: account.sum
              }))}
              totalExpenses={currentCategory.sum}
              detailPage
            />
            <CardList
              data={byAccounts}
              detailPage
              percentage
              totalSum={currentCategory.sum}
            />
          </SectionWrapper>
          <SectionWrapper
            sectionLabel={<ByMonthLabel monthlyAverage={monthlyAverage} />}
            detailPage
          >
            <BarChartCard
              data={byMonths.map((month) => ({
                x: setMonth(month.name),
                y: month.sum
              }))}
              detailPage
            />
            <CardList
              data={byMonths}
              detailPage
              cardWidth={225}
              formatName={setMonth}
              spendingTrend
            />
          </SectionWrapper>
          <section className="lg:px-4">
            <ExpensesList
              label={currentCategory?.name}
              expenses={formatArray(currentCategory?.transactions)}
              page="categories"
            />
          </section>
        </div>
      </div>
    </>
  );
}

CategoryDetail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
