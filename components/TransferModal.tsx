'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { playTap, playSuccess } from '@/lib/sounds';

interface Props {
  onClose: () => void;
}

const CONTACTS = [
  {
    name: 'Camila Montenegro',
    avatar: 'CM',
    color: '#e4fff0',
    textColor: '#74cc9b',
  },
  {
    name: 'Leonardo Echazu',
    avatar: 'LE',
    color: '#feead4',
    textColor: '#ef9c55',
  },
  {
    name: 'Martin Bozzini',
    avatar: 'MB',
    color: '#f3e5ff',
    textColor: '#b946ff',
  },
];

export default function TransferModal({ onClose }: Props) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    playTap();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setStep('success');
    playSuccess();
  };

  const handleClose = () => {
    playTap();
    onClose();
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/40 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      />

      <motion.div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[414px] bg-white rounded-t-3xl z-50 px-6 py-6"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="flex justify-center mb-5">
          <div className="w-10 h-1 bg-[#e5e7eb] rounded-full" />
        </div>

        {step === 'form' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2
              className="text-[#334154] text-xl font-semibold mb-6"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Transferir dinero
            </h2>

            <p
              className="text-[#aaa] text-xs mb-3"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Contactos recientes
            </p>
            <div className="flex gap-3 mb-5 overflow-x-auto scrollbar-hide pb-1">
              {CONTACTS.map((c) => (
                <motion.button
                  key={c.name}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    setRecipient(c.name);
                    playTap();
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all"
                    style={{
                      backgroundColor: c.color,
                      color: c.textColor,
                      borderColor:
                        recipient === c.name ? c.textColor : 'transparent',
                    }}
                  >
                    {c.avatar}
                  </div>
                  <span
                    className="text-[#616e7c] text-[10px] whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    {c.name.split(' ')[0]}
                  </span>
                </motion.button>
              ))}
            </div>

            <div className="flex flex-col gap-1.5 mb-4">
              <label
                className="text-[#334154] font-medium text-sm"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Destinatario
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Nombre o email del destinatario"
                className="w-full bg-[#f9fafc] rounded-xl px-4 py-3 text-sm text-[#334154] placeholder-[#aaa] outline-none border-2 border-transparent focus:border-[#005cee] transition-all duration-200"
                style={{ fontFamily: 'var(--font-poppins)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5 mb-6">
              <label
                className="text-[#334154] font-medium text-sm"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Monto (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa] text-sm">
                  $
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  className="w-full bg-[#f9fafc] rounded-xl px-4 py-3 pl-8 text-sm text-[#334154] placeholder-[#aaa] outline-none border-2 border-transparent focus:border-[#005cee] transition-all duration-200"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                />
              </div>
            </div>

            <motion.button
              className="w-full bg-[#005cee] text-white font-semibold text-base rounded-2xl py-4 disabled:opacity-50"
              style={{ fontFamily: 'var(--font-poppins)' }}
              disabled={!recipient || !amount || Number(amount) <= 0}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setStep('confirm');
                playTap();
              }}
            >
              Continuar
            </motion.button>
          </motion.div>
        )}

        {step === 'confirm' && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2
              className="text-[#334154] text-xl font-semibold mb-6"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Confirmar transferencia
            </h2>

            <div className="bg-[#f9fafc] rounded-2xl p-5 mb-6 flex flex-col gap-4">
              <div className="flex justify-between">
                <span
                  className="text-[#aaa] text-sm"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Para
                </span>
                <span
                  className="text-[#334154] text-sm font-medium"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  {recipient}
                </span>
              </div>
              <div className="border-t border-[#e5e7eb]" />
              <div className="flex justify-between">
                <span
                  className="text-[#aaa] text-sm"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Monto
                </span>
                <span
                  className="text-[#334154] text-lg font-semibold"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  ${amount}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                className="flex-1 border-2 border-[#e5e7eb] text-[#616e7c] font-medium text-sm rounded-2xl py-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setStep('form');
                  playTap();
                }}
              >
                Volver
              </motion.button>
              <motion.button
                className="flex-1 bg-[#005cee] text-white font-medium text-sm rounded-2xl py-3 disabled:opacity-70"
                style={{ fontFamily: 'var(--font-poppins)' }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                onClick={handleConfirm}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </div>
                ) : (
                  'Confirmar'
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
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
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="#74cc9b"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </motion.div>
            <h2
              className="text-[#334154] text-xl font-semibold mb-2"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              ¡Transferencia exitosa!
            </h2>
            <p
              className="text-[#aaa] text-sm text-center mb-6"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Se transfirieron ${amount} a {recipient}
            </p>
            <motion.button
              className="w-full bg-[#005cee] text-white font-semibold text-base rounded-2xl py-4"
              style={{ fontFamily: 'var(--font-poppins)' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleClose}
            >
              Listo
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
