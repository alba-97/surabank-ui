'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Transaction } from '@/interfaces';
import { playTap } from '@/services/sounds';
import TransactionItem from '@/components/TransactionItem';

interface MovementsProps {
  movements: Transaction[];
  searchOpen: boolean;
  page: number;
  total: number;
  pageSize: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function Movements({
  movements,
  searchOpen,
  page,
  total,
  pageSize,
  onPrev,
  onNext,
}: MovementsProps) {
  const isLastPage = page * pageSize >= total;

  return (
    <motion.div
      layout
      className="flex-1 px-6 pb-28"
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center mt-6 mb-4">
        <h2 className="text-[#334154] dark:text-[#f3f4f6] text-xl font-medium">
          {searchOpen ? 'Resultados' : 'Últimos movimientos'}
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {movements.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#616e7c] dark:text-[#9ca3af] text-sm text-center py-6"
            >
              No se encontraron movimientos
            </motion.p>
          ) : (
            movements.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: i * 0.04 }}
              >
                <TransactionItem transaction={tx} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {total > pageSize && (
        <motion.div
          className="flex items-center justify-center gap-6 mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.button
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer text-[#334154] dark:text-[#f3f4f6] ${page === 1 ? 'opacity-30' : 'bg-[#f0f4ff] dark:bg-[#1e293b]'}`}
            whileTap={page > 1 ? { scale: 0.9 } : {}}
            onClick={() => {
              if (page > 1) {
                playTap();
                onPrev();
              }
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>

          <span className="text-[#334154] dark:text-[#f3f4f6] text-sm font-medium tabular-nums">
            {page} / {Math.ceil(total / pageSize)}
          </span>

          <motion.button
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer text-[#334154] dark:text-[#f3f4f6] ${isLastPage ? 'opacity-30' : 'bg-[#f0f4ff] dark:bg-[#1e293b]'}`}
            whileTap={!isLastPage ? { scale: 0.9 } : {}}
            onClick={() => {
              if (!isLastPage) {
                playTap();
                onNext();
              }
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
