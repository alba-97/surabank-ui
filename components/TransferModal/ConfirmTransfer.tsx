'use client';

import { motion } from 'framer-motion';
import { playTap } from '@/services/sounds';
import type { Card } from '@/interfaces';
import Spinner from '@/components/Spinner';

interface ConfirmTransferProps {
  selectedCard: Card | undefined;
  recipientName: string;
  recipientEmail: string;
  amount: string;
  error: string;
  loading: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

export default function ConfirmTransfer({
  selectedCard,
  recipientName,
  recipientEmail,
  amount,
  error,
  loading,
  onBack,
  onConfirm,
}: ConfirmTransferProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
      <h2 className="text-[#334154] dark:text-[#f3f4f6] text-xl font-semibold mb-6">
        Confirmar transferencia
      </h2>

      <div className="bg-[#f9fafc] dark:bg-[#374151] rounded-2xl p-5 mb-6 flex flex-col gap-4">
        <div className="flex justify-between">
          <span className="text-[#aaa] dark:text-[#9ca3af] text-sm">Tarjeta</span>
          <span className="text-[#334154] dark:text-[#f3f4f6] text-sm font-medium text-right">
            {selectedCard
              ? `${selectedCard.issuer} **** ${selectedCard.lastDigits}`
              : '-'}
          </span>
        </div>
        <div className="border-t border-[#e5e7eb] dark:border-[#4b5563]" />
        <div className="flex justify-between">
          <span className="text-[#aaa] dark:text-[#9ca3af] text-sm">Para</span>
          <span className="text-[#334154] dark:text-[#f3f4f6] text-sm font-medium text-right max-w-[200px] truncate">
            {recipientName || recipientEmail}
          </span>
        </div>
        <div className="border-t border-[#e5e7eb] dark:border-[#4b5563]" />
        <div className="flex justify-between">
          <span className="text-[#aaa] dark:text-[#9ca3af] text-sm">Monto</span>
          <span className="text-[#334154] dark:text-[#f3f4f6] text-lg font-semibold">
            ${amount}
          </span>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-xs mb-3 text-center">{error}</p>
      )}

      <div className="flex gap-3">
        <motion.button
          className="flex-1 border-2 border-[#e5e7eb] dark:border-[#4b5563] text-[#616e7c] dark:text-[#9ca3af] font-medium text-sm rounded-2xl py-3 cursor-pointer"
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            onBack();
            playTap();
          }}
        >
          Volver
        </motion.button>
        <motion.button
          className="flex-1 bg-[#005cee] text-white font-medium text-sm rounded-2xl py-3 disabled:opacity-70 cursor-pointer"
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          onClick={onConfirm}
        >
          {loading ? (
            <Spinner />
          ) : (
            'Confirmar'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
