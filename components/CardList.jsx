import { motion } from 'framer-motion';
import cn from 'classnames';
import { nameToSlug, calcSpendingTrend } from '@utils/helpers';

import Card from '@components/Card';

export default function CardList({
  data = [],
  type,
  link,
  detailPage = false,
  cardWidth = 250,
  percentage,
  spendingTrend,
  formatName = (name) => name,
  totalSum = 0
}) {
  const containerClasses = cn(
    {
      'w-full xl:w-1/2 auto-rows-max': detailPage,
      'grid-cols-[repeat(auto-fill,minmax(200px,1fr))]': cardWidth === 200,
      'grid-cols-[repeat(auto-fill,minmax(225px,1fr))]': cardWidth === 225,
      'grid-cols-[repeat(auto-fill,minmax(250px,1fr))]': cardWidth === 250,
      'grid-cols-[repeat(auto-fill,minmax(275px,1fr))]': cardWidth === 275
    },
    'grid gap-4'
  );

  function setLinkUrl(name) {
    switch (type) {
      case 'account':
        return `/app/accounts/${nameToSlug(name)}`;
      case 'month':
        return `/app/months/${name}`;
      case 'category':
        return `/app/categories/${nameToSlug(name)}`;
      default:
        break;
    }
  }

  if (!data?.length)
    return (
      <ul className={containerClasses}>
        {[...Array(3).keys()].map((i) => (
          <li key={i} className="h-40 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </ul>
    );

  return (
    <ul className={containerClasses}>
      {data?.map((d, i) => (
        <motion.li
          key={i}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.64,
            delay: i * 0.05,
            ease: [0.175, 0.85, 0.42, 0.96]
          }}
        >
          <Card
            index={spendingTrend ? i : null}
            name={formatName(d.name)}
            quantity={d.quantity}
            sum={d.sum}
            percentage={percentage ? d.sum / totalSum : null}
            link={link ? setLinkUrl(d.name) : null}
            spendingTrend={spendingTrend ? calcSpendingTrend(i, data) : null}
          />
        </motion.li>
      ))}
    </ul>
  );
}
