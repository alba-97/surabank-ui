'use client';

import Image from 'next/image';
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
        <h2 className="text-fg text-xl font-medium">
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
              className="text-fg-2 text-sm text-center py-6"
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
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${page === 1 ? 'opacity-30' : 'bg-field'}`}
            whileTap={page > 1 ? { scale: 0.9 } : {}}
            onClick={() => {
              if (page > 1) {
                playTap();
                onPrev();
              }
            }}
          >
            <Image
              src="/icons/arrow-left.svg"
              width={16}
              height={16}
              alt="Anterior"
              className="dark:invert"
            />
          </motion.button>

          <span className="text-fg text-sm font-medium tabular-nums">
            {page} / {Math.ceil(total / pageSize)}
          </span>

          <motion.button
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${isLastPage ? 'opacity-30' : 'bg-field'}`}
            whileTap={!isLastPage ? { scale: 0.9 } : {}}
            onClick={() => {
              if (!isLastPage) {
                playTap();
                onNext();
              }
            }}
          >
            <Image
              src="/icons/arrow-right.svg"
              width={16}
              height={16}
              alt="Siguiente"
              className="dark:invert"
            />
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
