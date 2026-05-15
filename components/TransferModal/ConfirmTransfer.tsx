'use client';

import { motion } from 'framer-motion';
import { playTap } from '@/services/sounds';
import type { Card } from '@/interfaces';

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
      <h2 className="text-fg text-xl font-semibold mb-6">
        Confirmar transferencia
      </h2>

      <div className="bg-elevated rounded-2xl p-5 mb-6 flex flex-col gap-4">
        <div className="flex justify-between">
          <span className="text-fg-3 text-sm">Tarjeta</span>
          <span className="text-fg text-sm font-medium text-right">
            {selectedCard
              ? `${selectedCard.issuer} **** ${selectedCard.lastDigits}`
              : '-'}
          </span>
        </div>
        <div className="border-t border-divider" />
        <div className="flex justify-between">
          <span className="text-fg-3 text-sm">Para</span>
          <span className="text-fg text-sm font-medium text-right max-w-[200px] truncate">
            {recipientName || recipientEmail}
          </span>
        </div>
        <div className="border-t border-divider" />
        <div className="flex justify-between">
          <span className="text-fg-3 text-sm">Monto</span>
          <span className="text-fg text-lg font-semibold">${amount}</span>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-xs mb-3 text-center">{error}</p>
      )}

      <div className="flex gap-3">
        <motion.button
          className="flex-1 border-2 border-divider text-fg-2 font-medium text-sm rounded-2xl py-3 cursor-pointer"
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            onBack();
            playTap();
          }}
        >
          Volver
        </motion.button>
        <motion.button
          className="flex-1 bg-primary text-white font-medium text-sm rounded-2xl py-3 disabled:opacity-70 cursor-pointer"
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          onClick={onConfirm}
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Confirmar'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
