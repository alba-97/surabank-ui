'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getCards,
  getMovements,
  getAccount,
  getNotifications,
} from '@/services/api';
import {
  getToken,
  getName,
  clearSession,
  isAuthenticated,
} from '@/services/auth';
import { playTap } from '@/services/sounds';
import TransferModal from '@/components/TransferModal';
import Navbar from '@/components/Navbar';
import Spinner from '@/components/Spinner';
import ThemeToggle from '@/components/ThemeToggle';
import { Card, Notification, Transaction } from '@/interfaces';
import Movements from './_components/Movements';
import CardCarousel from './_components/CardCarousel';
import Header from './_components/Header';

const PAGE_SIZE = 5;

export default function HomePage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [movements, setMovements] = useState<Transaction[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showTransfer, setShowTransfer] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [accountBalance, setAccountBalance] = useState('0.00');
  const [balancesVisible, setBalancesVisible] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const initialLoadDone = useRef(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }
    const token = getToken()!;

    const load = async () => {
      setName(getName()?.split(' ')[0] ?? 'Usuario');
      try {
        const [cardsRes, movRes, accountRes, notifRes] = await Promise.all([
          getCards(token),
          getMovements(token, { pageNumber: 1 }),
          getAccount(token),
          getNotifications(token),
        ]);
        if (cardsRes.success) setCards(cardsRes.data);
        if (movRes.success) {
          setMovements(movRes.data);
          setTotal(movRes.total);
        }
        if (accountRes.success) setAccountBalance(accountRes.data.balance);
        if (notifRes.success) setNotifications(notifRes.data);
        initialLoadDone.current = true;
      } catch {
        clearSession();
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    if (!initialLoadDone.current) return;
    const token = getToken()!;
    const fetch = async () => {
      try {
        const res = await getMovements(token, {
          search: debouncedQuery,
          pageNumber: page,
        });
        if (res.success) {
          setMovements(res.data);
          setTotal(res.total);
        }
      } catch {
        clearSession();
        router.replace('/login');
      }
    };
    fetch();
  }, [debouncedQuery, page, router]);

  const toggleSearch = () => {
    playTap();
    if (searchOpen) {
      setSearchOpen(false);
      setSearchQuery('');
      setDebouncedQuery('');
      setPage(1);
    } else {
      setSearchOpen(true);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-page relative">
      <ThemeToggle />
      <Header
        name={name}
        accountBalance={accountBalance}
        balancesVisible={balancesVisible}
        onToggleBalances={() => setBalancesVisible((v) => !v)}
        searchOpen={searchOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleSearch={toggleSearch}
        searchInputRef={searchInputRef}
        notifications={notifications}
        onNotificationsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
      />

      <AnimatePresence>
        {!searchOpen && (
          <motion.div
            key="cards"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <CardCarousel cards={cards} balancesVisible={balancesVisible} />
          </motion.div>
        )}
      </AnimatePresence>

      <Movements
        movements={movements}
        searchOpen={searchOpen}
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        onPrev={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />

      <Navbar active="home" onTransfer={() => setShowTransfer(true)} />

      <AnimatePresence>
        {showTransfer && (
          <TransferModal
            onClose={() => setShowTransfer(false)}
            onTransferSuccess={async () => {
              const token = getToken();
              if (!token) return;
              const [cardsRes, movRes] = await Promise.all([
                getCards(token),
                getMovements(token, { pageNumber: 1 }),
              ]);
              if (cardsRes.success) setCards(cardsRes.data);
              if (movRes.success) {
                setMovements(movRes.data);
                setTotal(movRes.total);
              }
              initialLoadDone.current = true;
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
