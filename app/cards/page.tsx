'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getCards,
  getAccount,
  createCard,
  internalTransfer,
} from '@/services/api';
import { getToken, isAuthenticated, clearSession } from '@/services/auth';
import { playTap, playSuccess, playError } from '@/services/sounds';
import TransferModal from '@/components/TransferModal';
import Spinner from '@/components/Spinner';
import ThemeToggle from '@/components/ThemeToggle';
import Navbar from '@/components/Navbar';
import { Card } from '@/interfaces';
import NewCard from './_components/NewCard';
import MoveBalance from './_components/MoveBalance';

export default function CardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [accountBalance, setAccountBalance] = useState('0.00');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<'Visa' | 'Mastercard' | null>(null);
  const [transferring, setTransferring] = useState(false);
  const [fromKey, setFromKey] = useState('account');
  const [toKey, setToKey] = useState('');
  const [amount, setAmount] = useState('');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [showTransfer, setShowTransfer] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadData = async (token: string) => {
    const [cardsRes, accRes] = await Promise.all([
      getCards(token),
      getAccount(token),
    ]);
    if (cardsRes.success) setCards(cardsRes.data);
    if (accRes.success) setAccountBalance(accRes.data.balance);
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }
    const token = getToken()!;
    void (async () => {
      try {
        await loadData(token);
      } catch {
        clearSession();
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleCreate = async (issuer: 'Visa' | 'Mastercard') => {
    playTap();
    if (cards.length >= 6) {
      setFeedback({ type: 'error', text: 'Límite de 6 tarjetas alcanzado' });
      return;
    }
    setCreating(issuer);
    try {
      const token = getToken()!;
      const res = await createCard(token, issuer);
      if (res.success) {
        await loadData(token);
        playSuccess();
        setFeedback({ type: 'success', text: `Tarjeta ${issuer} creada` });
      } else {
        playError();
        setFeedback({
          type: 'error',
          text: res.message ?? 'Error al crear tarjeta',
        });
      }
    } catch {
      playError();
      setFeedback({ type: 'error', text: 'Error al crear tarjeta' });
    } finally {
      setCreating(null);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleTransfer = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || !toKey) return;
    playTap();
    setTransferring(true);
    try {
      const token = getToken()!;
      const fromType = fromKey === 'account' ? 'account' : 'card';
      const fromId = fromKey === 'account' ? undefined : parseInt(fromKey, 10);
      const toType = toKey === 'account' ? 'account' : 'card';
      const toId = toKey === 'account' ? undefined : parseInt(toKey, 10);
      const res = await internalTransfer(token, {
        fromType,
        fromId,
        toType,
        toId,
        amount: amt,
      });
      if (res.success) {
        await loadData(token);
        setAmount('');
        playSuccess();
        setFeedback({ type: 'success', text: 'Transferencia exitosa' });
        scrollToTop();
      } else {
        playError();
        setFeedback({ type: 'error', text: res.message });
        scrollToTop();
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      playError();
      setFeedback({
        type: 'error',
        text: axiosErr?.response?.data?.message ?? 'Error al transferir',
      });
      scrollToTop();
    } finally {
      setTransferring(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="mobile-container min-h-screen bg-page">
      <ThemeToggle />
      <div className="flex items-center justify-between px-6 pt-10 pb-6">
        <motion.button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-field cursor-pointer"
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            playTap();
            router.back();
          }}
        >
          <Image
            src="/icons/arrow-left.svg"
            width={18}
            height={18}
            alt="Volver"
            className="dark:invert"
          />
        </motion.button>
        <h1 className="text-fg text-lg font-semibold">Tarjetas</h1>
        <div className="w-10" />
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            className={`mx-6 mb-4 px-4 py-3 rounded-xl text-sm font-medium ${feedback.type === 'success' ? 'bg-[#74cc9b]/20 text-[#2d8a55]' : 'bg-red-50 text-red-600'}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-6 pb-32 flex flex-col gap-8">
        <NewCard cards={cards} creating={creating} onCreate={handleCreate} />
        <MoveBalance
          cards={cards}
          accountBalance={accountBalance}
          fromKey={fromKey}
          toKey={toKey}
          amount={amount}
          transferring={transferring}
          onFromChange={setFromKey}
          onToChange={setToKey}
          onAmountChange={setAmount}
          onTransfer={handleTransfer}
        />
      </div>

      <Navbar active="card" onTransfer={() => setShowTransfer(true)} />

      <AnimatePresence>
        {showTransfer && (
          <TransferModal
            onClose={() => setShowTransfer(false)}
            onTransferSuccess={() => {
              const token = getToken();
              if (token) loadData(token);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
