import Head from 'next/head';
import { state } from '@store';
import { useSnapshot } from 'valtio';
import { setMonth, formatArray } from '@utils/helpers';

import Layout from '@components/Layout';
import HeaderStats from '@components/HeaderStats';
import SectionWrapper from '@components/SectionWrapper';
import BarChartCard from '@components/BarChartCard';
import CardList from '@components/CardList';
import ByMonthLabel from '@components/ByMonthLabel';

export default function Dashboard() {
  const {
    transactions,
    totalExpenses,
    accounts,
    months,
    monthlyAverage,
    categories
  } = useSnapshot(state);

  return (
    <div className="relative flex-grow pb-10 mt-[63px] print:mt-0 max-w-screen-3xl mx-auto">
      <Head>
        <title>Expense Drop - Dashboard</title>
      </Head>
      <header className="flex justify-center px-4 lg:px-0">
        <HeaderStats
          transactions={formatArray(transactions)}
          totalExpenses={totalExpenses}
          transactionsQuantity={transactions.length}
        />
      </header>
      <div className="space-y-20 mt-10">
        <SectionWrapper sectionLabel="By Account">
          <BarChartCard
            data={accounts.map((account) => ({
              x: account.name,
              y: account.sum
            }))}
            totalExpenses={totalExpenses}
          />
          <CardList
            data={accounts}
            percentage
            totalSum={totalExpenses}
            link
            type="account"
          />
        </SectionWrapper>
        <SectionWrapper
          sectionLabel={<ByMonthLabel monthlyAverage={monthlyAverage} />}
        >
          <BarChartCard
            data={months.map((month) => ({
              x: setMonth(month.name),
              y: month.sum
            }))}
          />
          <CardList
            data={months}
            formatName={setMonth}
            cardWidth={225}
            link
            spendingTrend
            type="month"
          />
        </SectionWrapper>
        <SectionWrapper sectionLabel="By Category">
          <BarChartCard
            data={categories.map((category) => ({
              x: category.name,
              y: category.sum
            }))}
            totalExpenses={totalExpenses}
          />
          <CardList
            data={categories}
            percentage
            totalSum={totalExpenses}
            link
            type="category"
          />
        </SectionWrapper>
      </div>
    </div>
  );
}

Dashboard.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
