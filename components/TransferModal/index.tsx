'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { playTap, playSuccess, playError } from '@/services/sounds';
import {
  getContacts,
  getCards,
  transferMoney
} from '@/services/api';
import { getToken } from '@/services/auth';
import PaymentCard from './PaymentCard';
import RecentContacts from './RecentContacts';
import EmailAndAmount from './EmailAndAmount';
import ConfirmTransfer from './ConfirmTransfer';
import TransferSuccess from './TransferSuccess';
import { Card, Contact } from '@/interfaces';

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
    const load = async () => {
      try {
        const [contactsRes, cardsRes] = await Promise.all([
          getContacts(token),
          getCards(token),
        ]);
        if (contactsRes.success) setContacts(contactsRes.data);
        if (cardsRes.success) {
          setCards(cardsRes.data);
          if (cardsRes.data.length > 0) setSelectedCardId(cardsRes.data[0].id);
        }
      } finally {
        setContactsLoading(false);
      }
    };
    load();
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
    try {
      const res = await transferMoney(
        token,
        recipientEmail,
        Number(amount),
        selectedCardId,
      );
      if (res.success) {
        setStep('success');
        playSuccess();
      } else {
        playError();
        setError(res.message || 'Transfer failed');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      playError();
      setError(
        axiosErr?.response?.data?.message || 'Server error. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    playTap();
    onTransferSuccess?.();
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
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[414px] bg-white dark:bg-[#1f2937] rounded-t-3xl z-50 px-6 py-6"
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
            <h2 className="text-[#334154] dark:text-[#f3f4f6] text-xl font-semibold mb-6">
              Transferir dinero
            </h2>

            <PaymentCard
              cards={cards}
              selectedCardId={selectedCardId}
              onSelect={setSelectedCardId}
            />

            <RecentContacts
              contacts={contacts}
              loading={contactsLoading}
              recipientEmail={recipientEmail}
              onSelect={handleSelectContact}
            />

            <EmailAndAmount
              recipientEmail={recipientEmail}
              amount={amount}
              onEmailChange={handleEmailChange}
              onAmountChange={setAmount}
            />

            {error && (
              <p className="text-red-500 text-xs mb-3 text-center">{error}</p>
            )}

            <motion.button
              className="w-full bg-[#005cee] text-white font-semibold text-base rounded-2xl py-4 disabled:opacity-50 cursor-pointer"
              disabled={
                !recipientEmail ||
                !amount ||
                Number(amount) <= 0 ||
                !selectedCardId
              }
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
          <ConfirmTransfer
            selectedCard={selectedCard}
            recipientName={recipientName}
            recipientEmail={recipientEmail}
            amount={amount}
            error={error}
            loading={loading}
            onBack={() => {
              setStep('form');
              setError('');
            }}
            onConfirm={handleConfirm}
          />
        )}

        {step === 'success' && (
          <TransferSuccess
            amount={amount}
            recipientName={recipientName}
            recipientEmail={recipientEmail}
            onClose={handleClose}
          />
        )}
      </motion.div>
    </>
  );
}
