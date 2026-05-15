'use client';

import { motion } from 'framer-motion';
import { playTap } from '@/services/sounds';
import type { Card } from '@/interfaces';

const cardColorMap: Record<string, string> = {
  Mastercard: '#005cee',
  Visa: '#1a1a2e',
};

interface PaymentCardProps {
  cards: Card[];
  selectedCardId: number | null;
  onSelect: (id: number) => void;
}

export default function PaymentCard({
  cards,
  selectedCardId,
  onSelect,
}: PaymentCardProps) {
  return (
    <>
      <p className="text-fg-3 text-xs mb-3">Tarjeta de pago</p>
      <div className="overflow-hidden mb-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-3">
          {cards.length === 0 ? (
            <span className="text-fg-3 text-xs py-3">
              No hay tarjetas disponibles
            </span>
          ) : (
            cards.map((c) => (
              <motion.button
                key={c.id}
                className="flex-shrink-0 rounded-xl px-4 py-3 border-2 transition-all cursor-pointer"
                style={{
                  backgroundColor:
                    selectedCardId === c.id
                      ? 'var(--c-field)'
                      : 'var(--c-elevated)',
                  borderColor:
                    selectedCardId === c.id
                      ? cardColorMap[c.issuer] || 'var(--c-primary)'
                      : 'transparent',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onSelect(c.id);
                  playTap();
                }}
              >
                <p className="text-fg text-sm font-medium">{c.issuer}</p>
                <p className="text-fg-3 text-xs">
                  **** {c.lastDigits} · ${c.balance}
                </p>
              </motion.button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
