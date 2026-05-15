'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Card } from '@/lib/api';

const CARD_COLORS: Record<string, { bg: string; secondary: string }> = {
  Mastercard: { bg: 'from-[#005cee] to-[#0041b0]', secondary: '#1a6ff5' },
  Visa: { bg: 'from-[#1a1a2e] to-[#16213e]', secondary: '#0f3460' },
  default: { bg: 'from-[#334154] to-[#1e293b]', secondary: '#475569' },
};

function MastercardLogo() {
  return (
    <Image
      src="/icons/mastercard.svg"
      width={42}
      height={30}
      alt="Mastercard"
    />
  );
}

function VisaLogo() {
  return <Image src="/icons/visa.svg" width={48} height={48} alt="Visa" />;
}

export default function CardComponent({
  card,
  index,
}: {
  card: Card;
  index: number;
}) {
  const colors = CARD_COLORS[card.issuer] ?? CARD_COLORS.default;
  const isFirst = index === 0;

  return (
    <motion.div
      className={`relative bg-gradient-to-br ${colors.bg} rounded-3xl overflow-hidden shadow-[0_8px_30px_0_rgba(0,0,0,0.15)]`}
      style={{ width: 320, height: 185 }}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, rotate: isFirst ? -0.5 : 0.5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10"
        style={{ background: 'white' }}
      />
      <div
        className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10"
        style={{ background: 'white' }}
      />

      <div className="relative flex flex-col justify-between h-full p-5">
        <div className="flex items-start justify-between">
          <div>
            <p
              className="text-white/70 text-xs mb-1"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Balance
            </p>
            <div className="flex items-center gap-2">
              <span
                className="bg-white/20 text-white text-xs font-medium px-2 py-0.5 rounded-md"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {card.currency}
              </span>
              <motion.span
                className="text-white text-2xl font-semibold"
                style={{ fontFamily: 'var(--font-poppins)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {card.balance}
              </motion.span>
            </div>
          </div>
          {card.issuer === 'Mastercard' ? <MastercardLogo /> : <VisaLogo />}
        </div>

        <div className="flex items-center gap-3">
          {['•••• ', '•••• ', '•••• '].map((dots, i) => (
            <span
              key={i}
              className="text-white/80 text-base tracking-widest"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {dots}
            </span>
          ))}
          <span
            className="text-white text-base font-medium tracking-wider"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            {card.lastDigits}
          </span>
        </div>

        <div className="flex items-end justify-between">
          <p
            className="text-white text-sm"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            {card.name}
          </p>
          <div className="text-right">
            <p
              className="text-white/60 text-[10px]"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Exp. Date
            </p>
            <p
              className="text-white text-xs font-medium"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {card.expDate}
            </p>
          </div>
        </div>
      </div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{ x: [-400, 400] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 4,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}
