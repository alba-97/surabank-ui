'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Transaction } from '@/lib/api';
import { playTap } from '@/lib/sounds';

const TYPE_CONFIG = {
  SUS: {
    amountColor: '#b946ff',
    icon: '/icons/sub.svg',
    label: 'Suscripción',
  },
  CASH_IN: {
    amountColor: '#74cc9b',
    icon: '/icons/received.svg',
    label: 'Ingreso',
  },
  CASH_OUT: {
    amountColor: '#ef9c55',
    icon: '/icons/sent.svg',
    label: 'Gasto',
  },
};

const TX_LABEL: Record<string, string> = {
  SUS: 'Pago de suscripción',
  CASH_IN: 'Pago recibido',
  CASH_OUT: 'Pago enviado',
};

export default function TransactionItem({
  transaction,
}: {
  transaction: Transaction;
}) {
  const config = TYPE_CONFIG[transaction.transactionType];

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-[0_8px_30px_0_rgba(0,0,0,0.06)] px-4 py-4 flex items-center gap-3 cursor-pointer"
      whileHover={{ scale: 1.01, boxShadow: '0 12px 40px 0 rgba(0,0,0,0.1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => playTap()}
    >
      <motion.div
        className="flex-shrink-0"
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <Image src={config.icon} width={44} height={44} alt={config.label} />
      </motion.div>

      <div className="flex-1 min-w-0">
        <p className="text-[#616e7c] text-base font-medium truncate">
          {transaction.title}
        </p>
        <p className="text-[#aaa] text-xs mt-0.5">
          {TX_LABEL[transaction.transactionType] ?? transaction.transactionType}
        </p>
      </div>

      <p
        className="text-sm font-medium flex-shrink-0"
        style={{ color: config.amountColor }}
      >
        {transaction.transactionType === 'CASH_OUT' ? '' : '+'}
        {transaction.amount}
      </p>
    </motion.div>
  );
}
