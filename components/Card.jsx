import Link from 'next/link';
import cn from 'classnames';

import Tooltip from '@components/Tooltip';
import TrendSign from '@components/TrendSign';

export default function Card({
  index,
  name,
  sum,
  percentage,
  clickHandler,
  link,
  spendingTrend,
  fullHeight
}) {
  const percentageValue = Math.round(spendingTrend * 100);
  const spendingTrendContainer = cn('flex items-center border rounded px-1', {
    'text-green-500 border-green-300 bg-green-50': percentageValue < 0,
    'text-red-500 border-red-300 bg-red-50': percentageValue > 0,
    'text-gray-500 border-gray-400 bg-gray-50': percentageValue === 0
  });

  const CardContent = () => (
    <div
      onClick={clickHandler || null}
      className={`relative w-full ${
        fullHeight ? 'h-full' : 'h-auto'
      } bg-white  rounded-xl ${
        link ? '' : 'border border-gray-200'
      } space-y-4 shadow-xl shadow-gray-500/10 print:shadow-none transition duration-300 ease-in-out py-4 px-5 overflow-hidden`}
    >
      <p className="font-bold">{name}</p>
      <div className="flex items-end justify-between">
        <p className="inline-block">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(sum)}
        </p>
        {percentage && (
          <Tooltip dark label="% of Total Expenses">
            <p className="text-xs  text-cyan-500 border border-cyan-300 bg-cyan-50  rounded px-1">
              {new Intl.NumberFormat('en-US', { style: 'percent' }).format(
                percentage
              )}
            </p>
          </Tooltip>
        )}
        {index && index !== 0 ? (
          <Tooltip dark label="% Change from Previous Month (MoM)">
            <div className={spendingTrendContainer}>
              <span className="flex justify-center items-center">
                <TrendSign spendingTrend={percentageValue} />
              </span>
              <p className="text-xs font-medium">
                {new Intl.NumberFormat('en-US', {
                  style: 'percent',
                  signDisplay: 'never'
                }).format(spendingTrend)}
              </p>
            </div>
          </Tooltip>
        ) : null}
      </div>
    </div>
  );

  if (link) {
    return (
      <Link href={link}>
        <a className="w-full block focus:outline-none border border-gray-200 hover:border-black rounded-xl">
          <CardContent />
        </a>
      </Link>
    );
  }

  return <CardContent />;
}
