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

export default function AccountDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const { accounts, transactions } = useSnapshot(state);
  const currentAccount = useMemo(
    () => accounts.filter((account) => nameToSlug(account.name) === slug)[0],
    [accounts, slug]
  );
  const byCategories = useMemo(
    () =>
      getTransactions(currentAccount?.transactions, 'Category').sort(
        (a, b) => b.sum - a.sum
      ),
    [currentAccount]
  );
  const byMonths = useMemo(
    () => getTransactions(currentAccount?.transactions, 'Month'),
    [currentAccount]
  );
  const monthlyAverage = useMemo(
    () => calcMonthlyAverage(byMonths),
    [byMonths]
  );

  if (!currentAccount) {
    router.push('/');
    return null;
  }

  return (
    <div className="w-full pb-10 max-w-screen-3xl mx-auto mt-[63px]">
      <Head>
        <title>Expense Drop - {currentAccount?.name}</title>
      </Head>
      <header className="flex flex-col items-center justify-center">
        <h1 className="text-lg 2xl:text-2xl capitalize font-bold mb-6">
          {slug.split('-').join(' ')}
        </h1>
        <HeaderStats
          transactions={formatArray(transactions)}
          totalExpenses={currentAccount?.sum}
          transactionsQuantity={currentAccount?.transactions.length}
        />
      </header>
      <div className="space-y-20 mt-10">
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
        <SectionWrapper sectionLabel="By Category" detailPage>
          <BarChartCard
            data={byCategories.map((category) => ({
              x: category.name,
              y: category.sum
            }))}
            detailPage
            totalExpenses={currentAccount.sum}
          />
          <CardList
            data={byCategories}
            detailPage
            percentage
            totalSum={currentAccount.sum}
          />
        </SectionWrapper>
        <section className="lg:px-4">
          <ExpensesList
            label={currentAccount?.name}
            expenses={formatArray(currentAccount?.transactions)}
            page="accounts"
          />
        </section>
      </div>
    </div>
  );
}

AccountDetail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
