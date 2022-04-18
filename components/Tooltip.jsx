import { useState } from 'react';
import { useFloating, offset, shift, flip } from '@floating-ui/react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ease } from '@utils/animations';

export default function Tooltip({
  label,
  placement = 'bottom',
  dark,
  children
}) {
  const [isVisible, setIsVisible] = useState(false);
  const color = dark
    ? 'bg-black text-white border-gray-800'
    : 'bg-white text-[rgba(0,0,0,0.9)] border-gray-200';

  const { x, y, reference, floating, strategy } = useFloating({
    placement,
    middleware: [shift(), flip(), offset(10)]
  });

  return (
    <>
      <span
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="flex items-center"
        ref={reference}
      >
        {children}
      </span>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={floating}
            className={`text-[11px] 3xl:text-xs border ${color} shadow-lg rounded px-2 py-1 whitespace-nowrap`}
            style={{
              position: strategy,
              top: y ?? '',
              left: x ?? ''
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ ease, duration: 0.2 }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
