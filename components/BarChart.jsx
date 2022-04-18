import { useMemo } from 'react';
import { AxisLeft } from '@visx/axis';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { LinearGradient } from '@visx/gradient';
import { GridRows } from '@visx/grid';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { motion } from 'framer-motion';
import { useMedia } from 'react-use';

const yMargin = 5;
const xMargin = 70;

const getX = (d) => d.x;
const getY = (d) => Number(d.y);

const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  borderRadius: 4,
  color: 'white',
  padding: 10
};

const tickLabelProps = () => ({
  dx: '-0.25em',
  dy: '0.25em',
  fill: '#9CA3AF',
  fontFamily: 'Arial',
  fontSize: 10,
  textAnchor: 'end'
});
const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);

const formatNumber = (amount) =>
  `$${new Intl.NumberFormat('en-US', {}).format(amount)}`;

export default function BarChart({
  data = [],
  totalExpenses,
  width,
  height,
  currency = false
}) {
  const isMobile = useMedia('(max-width: 600px)');
  const xMax = width - (isMobile ? 0 : xMargin);
  const yMax = height - yMargin;

  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip
  } = useTooltip();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true
  });

  const xScale = useMemo(
    () =>
      scaleBand({
        range: [0, xMax],
        round: true,
        domain: data.map(getX),
        padding: 0.1
      }),
    [xMax, data]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...data.map(getY))],
        padding: 0.4
      }),
    [yMax, data]
  );

  return width < 10 ? null : (
    <div className="relative">
      <svg ref={containerRef} width={width} height={height}>
        <Group top={5} left={isMobile ? 0 : 70}>
          <GridRows scale={yScale} width={xMax} height={yMax} />
          {!isMobile && (
            <AxisLeft
              scale={yScale}
              tickLabelProps={tickLabelProps}
              hideAxisLine
              hideTicks
              hideZero
              tickFormat={formatNumber}
            />
          )}
          <LinearGradient id="bar-bg" from="#6366F1" to="#8B5CF6" />
          {data.map((d) => {
            const xLabel = getX(d);
            const barWidth = xScale.bandwidth();
            const barHeight = yMax - (yScale(getY(d)) ?? 0);
            const barX = xScale(xLabel);
            const barY = yMax - barHeight;
            return (
              <motion.rect
                className="rounded-t-lg"
                key={`bar-${xLabel}`}
                initial={{ opacity: 0, y: barHeight }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                fill="url(#bar-bg)"
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                onMouseLeave={() => {
                  hideTooltip();
                }}
                onMouseMove={(event) => {
                  let data = { ...d };
                  const eventSvgCoords = localPoint(event);
                  const left = barX + barWidth / 2;
                  if (totalExpenses) {
                    data = { ...data, percentage: d.y / totalExpenses };
                  }
                  showTooltip({
                    tooltipData: data,
                    tooltipTop: eventSvgCoords?.y,
                    tooltipLeft: left
                  });
                }}
              />
            );
          })}
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div className="text-xs mb-1">
            <strong>{tooltipData.x}</strong>
          </div>
          <div>
            <p className="text-xs">
              {currency ? formatCurrency(tooltipData.y) : tooltipData.y}{' '}
              {totalExpenses
                ? `(${new Intl.NumberFormat('en-US', {
                    style: 'percent'
                  }).format(tooltipData.percentage)})`
                : ''}
            </p>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
}
