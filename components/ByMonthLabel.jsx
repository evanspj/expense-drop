import Tooltip from '@components/Tooltip';

export default function ByMonthLabel({ monthlyAverage }) {
  return (
    <div className="flex items-center">
      <p>By Month</p>
      <Tooltip dark label="Average Monthly Expenses">
        <span className="text-sm font-semibold text-gray-900  rounded pl-1 pr-2 ml-4">
          <span className="border border-gray-300 bg-gray-50 text-[11px] text-gray-500 rounded px-1 mr-2">
            AVG
          </span>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(monthlyAverage)}
        </span>
      </Tooltip>
    </div>
  );
}
