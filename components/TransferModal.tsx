'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { playTap, playSuccess } from '@/lib/sounds';
import { getContacts, getCards, transferMoney, type Contact, type Card } from '@/lib/api';
import { getToken } from '@/lib/auth';

interface Props {
  onClose: () => void;
  onTransferSuccess?: () => void;
}

export default function TransferModal({ onClose, onTransferSuccess }: Props) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contactsLoading, setContactsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    Promise.all([
      getContacts(token),
      getCards(token),
    ]).then(([contactsRes, cardsRes]) => {
      if (contactsRes.success) setContacts(contactsRes.data);
      if (cardsRes.success) {
        setCards(cardsRes.data);
        if (cardsRes.data.length > 0) setSelectedCardId(cardsRes.data[0].id);
      }
    }).finally(() => setContactsLoading(false));
  }, []);

  const selectedCard = cards.find((c) => c.id === selectedCardId);

  const handleSelectContact = (contact: Contact) => {
    setRecipientEmail(contact.email);
    setRecipientName(contact.name);
    setError('');
    playTap();
  };

  const handleEmailChange = (value: string) => {
    setRecipientEmail(value);
    setRecipientName('');
    setError('');
    const match = contacts.find((c) => c.email === value);
    if (match) setRecipientName(match.name);
  };

  const handleConfirm = async () => {
    playTap();
    setLoading(true);
    setError('');

    const token = getToken();
    if (!token) {
      setError('Session expired');
      setLoading(false);
      return;
    }

    if (!selectedCardId) {
      setError('Select a card');
      setLoading(false);
      return;
    }

    const amountNum = Number(amount);

    try {
      const res = await transferMoney(token, recipientEmail, amountNum, selectedCardId);
      if (res.success) {
        setStep('success');
        playSuccess();
      } else {
        setError(res.message || 'Transfer failed');
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || 'Server error. Please try again.');
      } else {
        setError('Server error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    playTap();
    onTransferSuccess?.();
    onClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const colorPairs = [
    { bg: '#e4fff0', text: '#74cc9b' },
    { bg: '#feead4', text: '#ef9c55' },
    { bg: '#f3e5ff', text: '#b946ff' },
    { bg: '#ffe0e0', text: '#ff6b6b' },
    { bg: '#e0f0ff', text: '#5b9cf5' },
  ];

  const getColorPair = (index: number) => colorPairs[index % colorPairs.length];

  const cardColorMap: Record<string, string> = {
    Mastercard: '#005cee',
    Visa: '#1a1a2e',
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
              Tarjeta de pago
            </p>
            <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
              {cards.length === 0 ? (
                <span className="text-[#aaa] text-xs py-3">
                  No hay tarjetas disponibles
                </span>
              ) : (
                cards.map((c) => (
                  <motion.button
                    key={c.id}
                    className="flex-shrink-0 rounded-xl px-4 py-3 border-2 transition-all cursor-pointer"
                    style={{
                      backgroundColor: selectedCardId === c.id ? '#f0f4ff' : '#f9fafc',
                      borderColor: selectedCardId === c.id ? cardColorMap[c.issuer] || '#005cee' : 'transparent',
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedCardId(c.id);
                      playTap();
                    }}
                  >
                    <p className="text-[#334154] text-sm font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {c.issuer}
                    </p>
                    <p className="text-[#aaa] text-xs" style={{ fontFamily: 'var(--font-poppins)' }}>
                      **** {c.lastDigits} · ${c.balance}
                    </p>
                  </motion.button>
                ))
              )}
            </div>

            <p
              className="text-[#aaa] text-xs mb-3"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Contactos recientes
            </p>
            <div className="flex gap-3 mb-5 overflow-x-auto scrollbar-hide pb-1">
              {contactsLoading ? (
                <div className="flex items-center gap-2 py-3">
                  <div className="w-4 h-4 border-2 border-[#005cee]/20 border-t-[#005cee] rounded-full animate-spin" />
                  <span className="text-[#aaa] text-xs">Cargando...</span>
                </div>
              ) : contacts.length === 0 ? (
                <span className="text-[#aaa] text-xs py-3">
                  No hay contactos disponibles
                </span>
              ) : (
                contacts.map((c, i) => {
                  const pair = getColorPair(i);
                  return (
                    <motion.button
                      key={c.id}
                      className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer"
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleSelectContact(c)}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all"
                        style={{
                          backgroundColor: pair.bg,
                          color: pair.text,
                          borderColor:
                            recipientEmail === c.email
                              ? pair.text
                              : 'transparent',
                        }}
                      >
                        {getInitials(c.name)}
                      </div>
                      <span
                        className="text-[#616e7c] text-[10px] whitespace-nowrap"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                      >
                        {c.name.split(' ')[0]}
                      </span>
                    </motion.button>
                  );
                })
              )}
            </div>

            <div className="flex flex-col gap-1.5 mb-4">
              <label
                className="text-[#334154] font-medium text-sm"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Email del destinatario
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="email@ejemplo.com"
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

            {error && (
              <p className="text-red-500 text-xs mb-3 text-center">{error}</p>
            )}

            <motion.button
              className="w-full bg-[#005cee] text-white font-semibold text-base rounded-2xl py-4 disabled:opacity-50 cursor-pointer"
              style={{ fontFamily: 'var(--font-poppins)' }}
              disabled={!recipientEmail || !amount || Number(amount) <= 0 || !selectedCardId}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setError('');
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
                  Tarjeta
                </span>
                <span
                  className="text-[#334154] text-sm font-medium text-right"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  {selectedCard ? `${selectedCard.issuer} **** ${selectedCard.lastDigits}` : '-'}
                </span>
              </div>
              <div className="border-t border-[#e5e7eb]" />
              <div className="flex justify-between">
                <span
                  className="text-[#aaa] text-sm"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Para
                </span>
                <span
                  className="text-[#334154] text-sm font-medium text-right max-w-[200px] truncate"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  {recipientName || recipientEmail}
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

            {error && (
              <p className="text-red-500 text-xs mb-3 text-center">{error}</p>
            )}

            <div className="flex gap-3">
              <motion.button
                className="flex-1 border-2 border-[#e5e7eb] text-[#616e7c] font-medium text-sm rounded-2xl py-3 cursor-pointer"
                style={{ fontFamily: 'var(--font-poppins)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setStep('form');
                  setError('');
                  playTap();
                }}
              >
                Volver
              </motion.button>
              <motion.button
                className="flex-1 bg-[#005cee] text-white font-medium text-sm rounded-2xl py-3 disabled:opacity-70 cursor-pointer"
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
              Se transfirieron ${amount} a {recipientName || recipientEmail}
            </p>
            <motion.button
              className="w-full bg-[#005cee] text-white font-semibold text-base rounded-2xl py-4 cursor-pointer"
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