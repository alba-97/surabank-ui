'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, animate, type PanInfo } from 'framer-motion';
import Image from 'next/image';
import {
  getCards,
  getMovements,
  type Card,
  type Transaction,
} from '@/lib/api';
import { getToken, getName, clearSession, isAuthenticated } from '@/lib/auth';
import { playTap } from '@/lib/sounds';
import CardComponent from '@/components/CardComponent';
import TransactionItem from '@/components/TransactionItem';
import TransferModal from '@/components/TransferModal';

const PAGE_SIZE = 5;

export default function HomePage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [movements, setMovements] = useState<Transaction[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState<'home' | 'transfer'>('home');
  const [showTransfer, setShowTransfer] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const initialLoadDone = useRef(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    const token = getToken()!;
    setName(getName()?.split(' ')[0] ?? 'Usuario');

    Promise.all([
      getCards(token),
      getMovements(token, { pageNumber: 1 }),
    ]).then(([cardsRes, movRes]) => {
      if (cardsRes.success) setCards(cardsRes.data);
      if (movRes.success) { setMovements(movRes.data); setTotal(movRes.total); }
      initialLoadDone.current = true;
    }).catch(() => {
      clearSession();
      router.replace('/login');
    }).finally(() => setLoading(false));
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
    getMovements(token, { search: debouncedQuery, pageNumber: page })
      .then(res => {
        if (res.success) { setMovements(res.data); setTotal(res.total); }
      }).catch(() => {
        clearSession();
        router.replace('/login');
      });
  }, [debouncedQuery, page]);

  const handleLogout = () => {
    playTap();
    clearSession();
    router.push('/login');
  };

  const handleNavTap = (nav: 'home' | 'transfer') => {
    playTap();
    setActiveNav(nav);
    if (nav === 'transfer') setShowTransfer(true);
  };

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

  const isLastPage = page * PAGE_SIZE >= total;

  if (loading) {
    return (
      <div className="mobile-container flex items-center justify-center min-h-screen bg-white">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-12 h-12 border-3 border-[#005cee]/20 border-t-[#005cee] rounded-full animate-spin" />
          <p className="text-[#616e7c] text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
            Cargando...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-white relative">
      <div className="flex items-center justify-between px-6 pt-12 pb-4 gap-3">
        <AnimatePresence mode="wait">
          {searchOpen ? (
            <motion.div
              key="search-input"
              className="flex-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar movimiento..."
                className="w-full bg-[#f0f4ff] rounded-xl px-4 py-2.5 text-[#334154] outline-none text-sm"
                style={{ fontFamily: 'var(--font-poppins)' }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="greeting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p
                className="text-[#616e7c] text-base font-medium leading-tight"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Hola
              </p>
              <h1
                className="text-[#334154] text-[22px] font-semibold leading-tight"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {name}
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3 shrink-0">
          <motion.button
            className="w-10 h-10 flex items-center justify-center cursor-pointer"
            whileTap={{ scale: 0.9 }}
            onClick={toggleSearch}
          >
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="#334154" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </motion.span>
              ) : (
                <motion.span
                  key="glass"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.15 }}
                >
                  <Image src="/icons/glass.svg" width={19} height={19} alt="Buscar" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          {!searchOpen && (
            <motion.button
              className="w-10 h-10 flex items-center justify-center cursor-pointer"
              whileTap={{ scale: 0.9 }}
              onClick={() => playTap()}
            >
              <Image src="/icons/notifications.svg" width={18} height={21} alt="Notificaciones" />
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {!searchOpen && (
          <motion.div
            key="cards"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <CardCarousel cards={cards} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className="flex-1 px-6 pb-28"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center mt-6 mb-4">
          <h2
            className="text-[#334154] text-xl font-medium"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            {searchOpen ? 'Resultados' : 'Últimos movimientos'}
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {movements.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[#616e7c] text-sm text-center py-6"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                No se encontraron movimientos
              </motion.p>
            ) : (
              movements.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <TransactionItem transaction={tx} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {total > PAGE_SIZE && (
          <motion.div
            className="flex items-center justify-center gap-6 mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.button
              className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${page === 1 ? 'opacity-30' : 'bg-[#f0f4ff]'}`}
              whileTap={page > 1 ? { scale: 0.9 } : {}}
              onClick={() => { if (page > 1) { playTap(); setPage(p => p - 1); } }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="#334154" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>

            <span
              className="text-[#334154] text-sm font-medium tabular-nums"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {page} / {Math.ceil(total / PAGE_SIZE)}
            </span>

            <motion.button
              className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${isLastPage ? 'opacity-30' : 'bg-[#f0f4ff]'}`}
              whileTap={!isLastPage ? { scale: 0.9 } : {}}
              onClick={() => { if (!isLastPage) { playTap(); setPage(p => p + 1); } }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#334154" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[414px] bg-white rounded-t-3xl shadow-[0_-8px_30px_0_rgba(0,0,0,0.06)] px-10 py-4 flex items-center justify-between"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <motion.button
          className="flex flex-col items-center gap-1 cursor-pointer"
          whileTap={{ scale: 0.85 }}
          onClick={() => handleNavTap('home')}
        >
          <HomeIcon color={activeNav === 'home' ? '#6c8ff8' : '#071529'} />
        </motion.button>

        <motion.button
          className="flex flex-col items-center gap-1 cursor-pointer"
          whileTap={{ scale: 0.85 }}
          onClick={() => handleNavTap('transfer')}
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-all duration-200 ${
              activeNav === 'transfer' ? 'bg-[#6c8ff8]' : 'bg-[#6c8ff8]/10'
            }`}
          >
            <TransferIcon color={activeNav === 'transfer' ? 'white' : '#6c8ff8'} />
          </div>
        </motion.button>

        <motion.button
          className="flex flex-col items-center gap-1 cursor-pointer"
          whileTap={{ scale: 0.85 }}
          onClick={handleLogout}
        >
          <LogoutIcon color="#071529" />
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showTransfer && (
          <TransferModal
            onClose={() => {
              setShowTransfer(false);
              setActiveNav('home');
            }}
            onTransferSuccess={() => {
              const token = getToken();
              if (!token) return;
              getCards(token).then(res => {
                if (res.success) setCards(res.data);
              });
              getMovements(token, { pageNumber: 1 }).then(res => {
                if (res.success) { setMovements(res.data); setTotal(res.total); }
                initialLoadDone.current = true;
              });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TransferIcon({ color }: { color: string }) {
  return (
    <svg width='22' height='22' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M19,7 L5,7 M20,17 L5,17' stroke={color} strokeWidth='2' strokeLinecap='round' />
      <path d='M16,3 L19.2929,6.29289 C19.6834,6.68342 19.6834,7.31658 19.2929,7.70711 L16,11' stroke={color} strokeWidth='2' strokeLinecap='round' />
      <path d='M8,13 L4.70711,16.2929 C4.31658,16.6834 4.31658,17.3166 4.70711,17.7071 L8,21' stroke={color} strokeWidth='2' strokeLinecap='round' />
    </svg>
  );
}

function HomeIcon({ color }: { color: string }) {
  return (
    <svg width="27" height="29" viewBox="0 0 27 29" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.3299 8.01658C25.8347 8.42229 26.2433 8.93491 26.5261 9.51752C26.809 10.1001 26.9591 10.7382 26.9657 11.3859L26.9514 22.8282C26.9514 24.3206 26.3586 25.7518 25.3035 26.8072C24.2484 27.8626 22.8173 28.4557 21.3249 28.4561H18.8281C17.3242 28.4561 16.1031 27.2393 16.0959 25.7354V20.5696C16.0959 20.3778 16.0197 20.1938 15.8841 20.0582C15.7485 19.9226 15.5645 19.8464 15.3727 19.8464H11.6289C11.5328 19.8463 11.4377 19.8655 11.3491 19.9026C11.2605 19.9398 11.1802 19.9942 11.1129 20.0627C11.0455 20.1313 10.9925 20.2125 10.957 20.3018C10.9214 20.391 10.904 20.4864 10.9057 20.5825V22.5541C10.8953 22.845 10.7724 23.1205 10.563 23.3225C10.3535 23.5246 10.0739 23.6376 9.78282 23.6376C9.49178 23.6376 9.2121 23.5246 9.00266 23.3225C8.79322 23.1205 8.67036 22.845 8.65997 22.5541V20.5825C8.65997 19.7917 8.97412 19.0332 9.53333 18.474C10.0925 17.9148 10.851 17.6007 11.6418 17.6007H15.3856C16.1745 17.6037 16.9299 17.9192 17.4867 18.4781C18.0434 19.0369 18.356 19.7936 18.356 20.5825V25.7354C18.356 25.998 18.5669 26.209 18.8295 26.209H21.3866C22.2799 26.209 23.1367 25.8542 23.7685 25.2226C24.4004 24.5911 24.7555 23.7345 24.7559 22.8411V11.4117C24.7513 11.0992 24.6774 10.7916 24.5394 10.5112C24.4014 10.2307 24.2028 9.98448 23.958 9.79019L15.3354 2.91387C14.8082 2.47969 14.1465 2.24228 13.4635 2.24228C12.7805 2.24228 12.1188 2.47969 11.5916 2.91387L8.82211 4.98452C8.57519 5.14531 8.27579 5.20473 7.98617 5.15041C7.69656 5.0961 7.43903 4.93223 7.26715 4.69289C7.09527 4.45355 7.02227 4.15716 7.06333 3.86538C7.10439 3.57359 7.25635 3.30886 7.48761 3.12625L10.2183 1.1417C11.138 0.402785 12.2823 0 13.462 0C14.6418 0 15.7861 0.402785 16.7058 1.1417L25.3299 8.01658ZM5.6279 26.1975H11.3677V26.2219C11.6657 26.2219 11.9515 26.3403 12.1622 26.551C12.3729 26.7617 12.4913 27.0475 12.4913 27.3455C12.4913 27.6434 12.3729 27.9292 12.1622 28.1399C11.9515 28.3506 11.6657 28.469 11.3677 28.469H5.6279C4.13597 28.466 2.70604 27.8719 1.65122 26.8168C0.596399 25.7617 0.0026543 24.3316 0 22.8397V11.4117C0.00976914 10.7596 0.166285 10.1181 0.457929 9.53485C0.749572 8.95157 1.16885 8.44146 1.68464 8.04241L2.72068 7.26753C2.95736 7.15593 3.22556 7.13043 3.47903 7.19544C3.7325 7.26044 3.95533 7.41188 4.10908 7.62362C4.26282 7.83536 4.33784 8.09413 4.32119 8.35527C4.30454 8.61641 4.19727 8.86355 4.01788 9.05406L3.00767 9.8031C2.77118 9.99979 2.58057 10.2458 2.4492 10.5239C2.31782 10.8021 2.24886 11.1055 2.24714 11.4131V22.8296C2.25356 23.7232 2.61217 24.5782 3.24512 25.209C3.87808 25.8398 4.73429 26.1941 5.6279 26.1975Z"
        fill={color}
      />
    </svg>
  );
}

function LogoutIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.3915 18.0952C17.9607 18.0952 18.4227 18.5458 18.4227 19.101V20.3302C18.4227 23.5255 15.7578 26.125 12.4809 26.125H5.95386C2.6716 26.125 0 23.5189 0 20.3159C0 19.7607 0.462006 19.3113 1.03114 19.3113C1.60028 19.3113 2.06229 19.7607 2.06229 20.3159C2.06229 22.4112 3.80854 24.1133 5.95386 24.1133H12.4809C14.6208 24.1133 16.3604 22.4164 16.3604 20.3302V19.101C16.3604 18.5458 16.8224 18.0952 17.3915 18.0952ZM26.4685 12.0556C26.8864 12.0556 27.2627 12.3012 27.422 12.6787C27.5814 13.0549 27.4917 13.4886 27.197 13.776L23.284 17.576C23.0818 17.7707 22.8194 17.87 22.5556 17.87C22.2917 17.87 22.0266 17.7707 21.8257 17.5734C21.424 17.1789 21.424 16.5427 21.8284 16.1509L23.9724 14.0686H10.38C9.81087 14.0686 9.34753 13.6179 9.34753 13.0628C9.34753 12.5076 9.81087 12.0556 10.38 12.0556H26.4685ZM12.4677 0C15.7513 0 18.4229 2.60607 18.4229 5.80913V7.02529C18.4229 7.57916 17.9609 8.02984 17.3918 8.02984C16.8227 8.02984 16.3607 7.57916 16.3607 7.02529V5.80913C16.3607 3.71382 14.6144 2.01171 12.4677 2.01171H5.94207C3.80211 2.01171 2.06256 3.7099 2.06256 5.79476V15.7422C2.06256 16.2974 1.60055 16.7481 1.03141 16.7481C0.462274 16.7481 0.00026783 16.2974 0.00026783 15.7422V5.79476C0.00026783 2.59954 2.66517 0 5.94207 0H12.4677ZM21.823 8.55615C22.2248 8.15903 22.8756 8.15642 23.2814 8.54831L24.267 9.4993C24.6727 9.89119 24.6754 10.5274 24.275 10.9219C24.0728 11.1204 23.8077 11.221 23.5425 11.221C23.28 11.221 23.0176 11.123 22.8167 10.9297L21.8297 9.9774C21.4253 9.58682 21.4226 8.94935 21.823 8.55615Z"
        fill={color}
      />
    </svg>
  );
}

const CARD_STRIDE = 320 + 16;

function CardCarousel({ cards }: { cards: Card[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const x = useMotionValue(0);

  const snapTo = (index: number) => {
    setActiveIndex(index);
    animate(x, -index * CARD_STRIDE, { type: 'spring', stiffness: 320, damping: 32 });
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    let next = activeIndex;

    if (velocity < -300 || offset < -CARD_STRIDE / 3) {
      next = Math.min(activeIndex + 1, cards.length - 1);
    } else if (velocity > 300 || offset > CARD_STRIDE / 3) {
      next = Math.max(activeIndex - 1, 0);
    }
    snapTo(next);
  };

  return (
    <div className='overflow-x-clip py-3 -my-3'>
      <div className='pl-6 cursor-grab active:cursor-grabbing'>
        <motion.div
          className='flex gap-4 select-none'
          style={{ x }}
          drag='x'
          dragConstraints={{ left: -(cards.length - 1) * CARD_STRIDE, right: 0 }}
          dragElastic={0.12}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
        >
          {cards.map((card, i) => (
            <div key={card.id} style={{ flexShrink: 0 }}>
              <CardComponent card={card} index={i} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
