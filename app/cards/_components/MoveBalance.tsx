'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Card } from '@/interfaces';

type Source =
  | { type: 'account'; label: string; balance: string }
  | { type: 'card'; id: number; label: string; balance: string };

function buildSources(cards: Card[], accountBalance: string): Source[] {
  return [
    { type: 'account', label: 'Cuenta', balance: accountBalance },
    ...cards.map((c) => ({
      type: 'card' as const,
      id: c.id,
      label: `${c.issuer} ••••${c.lastDigits}`,
      balance: c.balance,
    })),
  ];
}

function buildDestinations(sources: Source[], fromKey: string): Source[] {
  return sources.filter((s) => {
    if (fromKey === 'account') return s.type === 'card';
    const fromId = parseInt(fromKey, 10);
    return s.type === 'account' || (s.type === 'card' && s.id !== fromId);
  });
}

interface MoveBalanceProps {
  cards: Card[];
  accountBalance: string;
  fromKey: string;
  toKey: string;
  amount: string;
  transferring: boolean;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onTransfer: () => void;
}

export default function MoveBalance({
  cards,
  accountBalance,
  fromKey,
  toKey,
  amount,
  transferring,
  onFromChange,
  onToChange,
  onAmountChange,
  onTransfer,
}: MoveBalanceProps) {
  const sources = buildSources(cards, accountBalance);
  const dests = buildDestinations(sources, fromKey);

  const selectClass =
    'w-full appearance-none bg-field rounded-xl pl-4 pr-10 py-3 text-fg text-sm outline-none cursor-pointer';

  return (
    <section>
      <h2 className="text-fg text-base font-semibold mb-4">Mover saldo</h2>
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-fg-2 text-xs mb-1 block">Desde</label>
          <div className="relative">
            <select
              value={fromKey}
              onChange={(e) => {
                onFromChange(e.target.value);
                onToChange('');
              }}
              className={selectClass}
            >
              {sources.map((s) => (
                <option
                  key={s.type === 'account' ? 'account' : s.id}
                  value={s.type === 'account' ? 'account' : String(s.id)}
                >
                  {s.label} — ${s.balance}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Image
                src="/icons/chevron.svg"
                className="w-4 h-4 opacity-40 dark:invert"
                width={24}
                height={24}
                alt=""
              />
            </span>
          </div>
        </div>

        <div>
          <label className="text-fg-2 text-xs mb-1 block">Hacia</label>
          <div className="relative">
            <select
              value={toKey}
              onChange={(e) => onToChange(e.target.value)}
              className={selectClass}
            >
              <option value="">Seleccionar destino</option>
              {dests.map((s) => (
                <option
                  key={s.type === 'account' ? 'account' : s.id}
                  value={s.type === 'account' ? 'account' : String(s.id)}
                >
                  {s.label} — ${s.balance}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Image
                src="/icons/chevron.svg"
                className="w-4 h-4 opacity-40 dark:invert"
                width={24}
                height={24}
                alt=""
              />
            </span>
          </div>
        </div>

        <div>
          <label className="text-fg-2 text-xs mb-1 block">Monto</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.00"
            className="w-full bg-field rounded-xl px-4 py-3 text-fg text-sm outline-none"
          />
        </div>

        <motion.button
          className="w-full bg-accent text-white font-semibold rounded-2xl py-4 mt-1 cursor-pointer disabled:opacity-50"
          whileTap={{ scale: 0.97 }}
          onClick={onTransfer}
          disabled={
            !toKey || !amount || parseFloat(amount) <= 0 || transferring
          }
        >
          {transferring ? 'Transfiriendo...' : 'Transferir'}
        </motion.button>
      </div>
    </section>
  );
}
