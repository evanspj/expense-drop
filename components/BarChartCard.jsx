import cn from 'classnames';
import { ParentSize } from '@visx/responsive';

import BarChart from '@components/BarChart';

export default function BarChartCard({
  data,
  totalExpenses = 0,
  currency = true,
  detailPage = false
}) {
  const containerClasses = cn(
    { 'w-full xl:w-1/2': detailPage },
    'h-[250px] lg:h-[300px] 2xl:h-[400px] bg-white border border-gray-200 rounded-xl shadow-xl shadow-gray-500/10 print:shadow-none pt-4 lg:pt-8',
    { 'bg-gray-100 shadow-none border-none animate-pulse': !data?.length }
  );

  return (
    <div className={containerClasses}>
      <ParentSize>
        {({ width, height }) => (
          <BarChart
            data={data}
            totalExpenses={totalExpenses}
            width={width}
            height={height}
            currency={currency}
          />
        )}
      </ParentSize>
    </div>
  );
}
