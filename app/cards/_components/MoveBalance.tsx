'use client';

import { motion } from 'framer-motion';
import type { Card } from '@/lib/api';

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

  return (
    <section>
      <h2 className="text-[#334154] text-base font-semibold mb-4">
        Mover saldo
      </h2>
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-[#616e7c] text-xs mb-1 block">Desde</label>
          <select
            value={fromKey}
            onChange={(e) => {
              onFromChange(e.target.value);
              onToChange('');
            }}
            className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#334154] text-sm outline-none cursor-pointer"
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
        </div>

        <div>
          <label className="text-[#616e7c] text-xs mb-1 block">Hacia</label>
          <select
            value={toKey}
            onChange={(e) => onToChange(e.target.value)}
            className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#334154] text-sm outline-none cursor-pointer"
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
        </div>

        <div>
          <label className="text-[#616e7c] text-xs mb-1 block">Monto</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.00"
            className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#334154] text-sm outline-none"
          />
        </div>

        <motion.button
          className="w-full bg-[#6c8ff8] text-white font-semibold rounded-2xl py-4 mt-1 cursor-pointer disabled:opacity-50"
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
