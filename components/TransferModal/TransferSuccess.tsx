'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface TransferSuccessProps {
  amount: string;
  recipientName: string;
  recipientEmail: string;
  onClose: () => void;
}

export default function TransferSuccess({
  amount,
  recipientName,
  recipientEmail,
  onClose,
}: TransferSuccessProps) {
  return (
    <motion.div
      className="flex flex-col items-center py-6"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 15 }}
    >
      <motion.div
        className="w-20 h-20 bg-[#e4fff0] rounded-full flex items-center justify-center mb-5"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.4 }}
      >
        <Image src="/icons/check.svg" width={36} height={36} alt="Éxito" />
      </motion.div>
      <h2 className="text-fg text-xl font-semibold mb-2">
        ¡Transferencia exitosa!
      </h2>
      <p className="text-fg-3 text-sm text-center mb-6">
        Se transfirieron ${amount} a {recipientName || recipientEmail}
      </p>
      <motion.button
        className="w-full bg-primary text-white font-semibold text-base rounded-2xl py-4 cursor-pointer"
        whileTap={{ scale: 0.97 }}
        onClick={onClose}
      >
        Listo
      </motion.button>
    </motion.div>
  );
}
