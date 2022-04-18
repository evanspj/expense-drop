import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

import Tooltip from '@components/Tooltip';
import TrendSign from '@components/TrendSign';

export default function HeaderStats({
  transactions,
  totalExpenses,
  transactionsQuantity,
  spendingTrend
}) {
  const [earliestDate, setEarliestDate] = useState(null);
  const [latestDate, setLatestDate] = useState(null);
  const percentage = Math.round(spendingTrend * 100);

  useEffect(() => {
    if (!transactions?.length) return;

    const dates = transactions.map((t) => t.Date);
    const firstDate = dates.reduce((pre, cur) =>
      Date.parse(pre) > Date.parse(cur) ? cur : pre
    );
    const lastDate = dates.reduce((pre, cur) =>
      Date.parse(pre) < Date.parse(cur) ? cur : pre
    );
    setEarliestDate(firstDate);
    setLatestDate(lastDate);
  }, [transactions]);

  return (
    <div className="bg-white grid grid-cols-2 gap-x-4 gap-y-6 md:inline-flex rounded-xl border border-gray-200 shadow-xl shadow-gray-500/10 md:divide-x divide-gray-200 py-6 px-2">
      <div className="hidden md:block w-full lg:w-auto text-center px-6">
        <div className="flex">
          <div className="bg-gray-100 rounded-lg leading-none font-medium px-3 py-1">
            <p className="text-xs uppercase whitespace-nowrap">
              {earliestDate ? dayjs(earliestDate).format('MMM DD') : null}
            </p>
            <p className="text-sm">
              {earliestDate ? dayjs(earliestDate).format('YYYY') : null}
            </p>
          </div>
          <span className="flex items-center mx-4">to</span>
          <div className="bg-gray-100 rounded-lg leading-none font-medium px-3 py-1">
            <p className="text-xs uppercase whitespace-nowrap">
              {latestDate ? dayjs(latestDate).format('MMM DD') : null}
            </p>
            <p className="text-sm">
              {latestDate ? dayjs(latestDate).format('YYYY') : null}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-auto flex flex-col justify-center text-center px-6">
        <p className="inline-block font-semibold text-xl pb-1">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(totalExpenses)}
        </p>
        <p className="text-sm md:text-xs text-gray-400">Total Amount</p>
      </div>
      <div className="w-full lg:w-auto flex flex-col justify-center text-center px-6">
        <p className="inline-block font-semibold text-xl pb-1">
          {transactionsQuantity}
        </p>
        <p className="text-sm md:text-xs text-gray-400">Transactions</p>
      </div>
      {spendingTrend && (
        <Tooltip label="% Change from Previous Month (MoM)" dark>
          <div className="w-full lg:w-auto text-left 2xl:text-center px-6">
            <div
              className={`flex items-center ${
                percentage > 0 ? 'text-red-500' : 'text-green-500'
              }`}
            >
              <TrendSign large spendingTrend={percentage} />
              <p className="inline-block font-semibold text-xl pb-1">
                {new Intl.NumberFormat('en-US', {
                  style: 'percent',
                  signDisplay: 'never'
                }).format(spendingTrend)}
              </p>
            </div>
            <p className="text-sm md:text-xs text-gray-400">MoM</p>
          </div>
        </Tooltip>
      )}
    </div>
  );
}
