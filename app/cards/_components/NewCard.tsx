'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Card } from '@/lib/api';

interface NewCardProps {
  cards: Card[];
  creating: 'Visa' | 'Mastercard' | null;
  onCreate: (issuer: 'Visa' | 'Mastercard') => void;
}

export default function NewCard({ cards, creating, onCreate }: NewCardProps) {
  const atLimit = cards.length >= 6;

  return (
    <section>
      <h2 className="text-[#334154] text-base font-semibold mb-1">
        Nueva tarjeta
      </h2>
      {atLimit && (
        <p className="text-[#616e7c] text-xs mb-3">
          Límite de 6 tarjetas alcanzado
        </p>
      )}
      <div className="flex gap-4">
        {(['Visa', 'Mastercard'] as const).map((issuer) => (
          <motion.button
            key={issuer}
            className={`flex-1 h-24 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-opacity ${atLimit ? 'opacity-40' : ''} ${issuer === 'Visa' ? 'bg-gradient-to-br from-[#1a1a2e] to-[#16213e]' : 'bg-gradient-to-br from-[#005cee] to-[#0041b0]'}`}
            whileTap={!atLimit ? { scale: 0.95 } : {}}
            onClick={() => !atLimit && onCreate(issuer)}
            disabled={atLimit || creating !== null}
          >
            {creating === issuer ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Image
                  src={`/icons/${issuer.toLowerCase()}.svg`}
                  width={issuer === 'Visa' ? 44 : 36}
                  height={issuer === 'Visa' ? 44 : 26}
                  alt={issuer}
                />
                <span className="text-white/70 text-xs">+ Nueva {issuer}</span>
              </>
            )}
          </motion.button>
        ))}
      </div>
      {cards.length > 0 && (
        <p className="text-[#616e7c] text-xs mt-2">
          {cards.length} / 6 tarjetas
        </p>
      )}
    </section>
  );
}
