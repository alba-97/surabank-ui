'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, animate, type PanInfo } from 'framer-motion';
import Image from 'next/image';
import {
  getCards,
  getLastMovements,
  type Card,
  type Transaction,
} from '@/lib/api';
import { getToken, getName, clearSession, isAuthenticated } from '@/lib/auth';
import { playTap } from '@/lib/sounds';
import CardComponent from '@/components/CardComponent';
import TransactionItem from '@/components/TransactionItem';
import TransferModal from '@/components/TransferModal';

export default function HomePage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [movements, setMovements] = useState<Transaction[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState<'home' | 'movements' | 'transfer'>(
    'home',
  );
  const [showTransfer, setShowTransfer] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }
    const token = getToken()!;
    const userName = getName() ?? 'Usuario';
    setName(userName.split(' ')[0]);

    Promise.all([getCards(token), getLastMovements(token)])
      .then(([cardsRes, movRes]) => {
        if (cardsRes.success) setCards(cardsRes.data);
        if (movRes.success) setMovements(movRes.data);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    playTap();
    clearSession();
    router.push('/login');
  };

  const handleNavTap = (nav: 'home' | 'movements' | 'transfer') => {
    playTap();
    setActiveNav(nav);
    if (nav === 'transfer') setShowTransfer(true);
  };

  if (loading) {
    return (
      <div className="mobile-container flex items-center justify-center min-h-screen bg-white">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-12 h-12 border-3 border-[#005cee]/20 border-t-[#005cee] rounded-full animate-spin" />
          <p
            className="text-[#616e7c] text-sm"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Cargando...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-white relative">
      <motion.div
        className="flex items-center justify-between px-6 pt-12 pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
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
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            className="w-10 h-10 flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
            onClick={() => playTap()}
          >
            <Image src="/icons/glass.svg" width={19} height={19} alt="Buscar" />
          </motion.button>
          <motion.button
            className="w-10 h-10 flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
            onClick={() => playTap()}
          >
            <Image
              src="/icons/notifications.svg"
              width={18}
              height={21}
              alt="Notificaciones"
            />
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <CardCarousel cards={cards} />
      </motion.div>

      <div className="flex-1 px-6 pb-28">
        <motion.div
          className="flex items-center justify-between mt-6 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2
            className="text-[#334154] text-xl font-medium"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Últimos movimientos
          </h2>
          <motion.button
            className="text-[#005cee] p-1"
            whileTap={{ scale: 0.9 }}
            onClick={() => playTap()}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </motion.button>
        </motion.div>

        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {movements.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
              >
                <TransactionItem transaction={tx} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[414px] bg-white rounded-t-3xl shadow-[0_-8px_30px_0_rgba(0,0,0,0.06)] px-10 py-4 flex items-center justify-between"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <motion.button
          className="flex flex-col items-center gap-1"
          whileTap={{ scale: 0.85 }}
          onClick={() => handleNavTap('home')}
        >
          <HomeIcon color={activeNav === 'home' ? '#6c8ff8' : '#071529'} />
        </motion.button>

        <motion.button
          className="flex flex-col items-center gap-1"
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
          className="flex flex-col items-center gap-1"
          whileTap={{ scale: 0.85 }}
          onClick={() => handleNavTap('movements')}
        >
          <DocumentIcon
            color={activeNav === 'movements' ? '#6c8ff8' : '#071529'}
          />
        </motion.button>

        <motion.button
          className="flex flex-col items-center gap-1"
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
    <svg
      width="27"
      height="29"
      viewBox="0 0 27 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.3299 8.01658C25.8347 8.42229 26.2433 8.93491 26.5261 9.51752C26.809 10.1001 26.9591 10.7382 26.9657 11.3859L26.9514 22.8282C26.9514 24.3206 26.3586 25.7518 25.3035 26.8072C24.2484 27.8626 22.8173 28.4557 21.3249 28.4561H18.8281C17.3242 28.4561 16.1031 27.2393 16.0959 25.7354V20.5696C16.0959 20.3778 16.0197 20.1938 15.8841 20.0582C15.7485 19.9226 15.5645 19.8464 15.3727 19.8464H11.6289C11.5328 19.8463 11.4377 19.8655 11.3491 19.9026C11.2605 19.9398 11.1802 19.9942 11.1129 20.0627C11.0455 20.1313 10.9925 20.2125 10.957 20.3018C10.9214 20.391 10.904 20.4864 10.9057 20.5825V22.5541C10.8953 22.845 10.7724 23.1205 10.563 23.3225C10.3535 23.5246 10.0739 23.6376 9.78282 23.6376C9.49178 23.6376 9.2121 23.5246 9.00266 23.3225C8.79322 23.1205 8.67036 22.845 8.65997 22.5541V20.5825C8.65997 19.7917 8.97412 19.0332 9.53333 18.474C10.0925 17.9148 10.851 17.6007 11.6418 17.6007H15.3856C16.1745 17.6037 16.9299 17.9192 17.4867 18.4781C18.0434 19.0369 18.356 19.7936 18.356 20.5825V25.7354C18.356 25.998 18.5669 26.209 18.8295 26.209H21.3866C22.2799 26.209 23.1367 25.8542 23.7685 25.2226C24.4004 24.5911 24.7555 23.7345 24.7559 22.8411V11.4117C24.7513 11.0992 24.6774 10.7916 24.5394 10.5112C24.4014 10.2307 24.2028 9.98448 23.958 9.79019L15.3354 2.91387C14.8082 2.47969 14.1465 2.24228 13.4635 2.24228C12.7805 2.24228 12.1188 2.47969 11.5916 2.91387L8.82211 4.98452C8.57519 5.14531 8.27579 5.20473 7.98617 5.15041C7.69656 5.0961 7.43903 4.93223 7.26715 4.69289C7.09527 4.45355 7.02227 4.15716 7.06333 3.86538C7.10439 3.57359 7.25635 3.30886 7.48761 3.12625L10.2183 1.1417C11.138 0.402785 12.2823 0 13.462 0C14.6418 0 15.7861 0.402785 16.7058 1.1417L25.3299 8.01658ZM5.6279 26.1975H11.3677V26.2219C11.6657 26.2219 11.9515 26.3403 12.1622 26.551C12.3729 26.7617 12.4913 27.0475 12.4913 27.3455C12.4913 27.6434 12.3729 27.9292 12.1622 28.1399C11.9515 28.3506 11.6657 28.469 11.3677 28.469H5.6279C4.13597 28.466 2.70604 27.8719 1.65122 26.8168C0.596399 25.7617 0.0026543 24.3316 0 22.8397V11.4117C0.00976914 10.7596 0.166285 10.1181 0.457929 9.53485C0.749572 8.95157 1.16885 8.44146 1.68464 8.04241L2.72068 7.26753C2.95736 7.15593 3.22556 7.13043 3.47903 7.19544C3.7325 7.26044 3.95533 7.41188 4.10908 7.62362C4.26282 7.83536 4.33784 8.09413 4.32119 8.35527C4.30454 8.61641 4.19727 8.86355 4.01788 9.05406L3.00767 9.8031C2.77118 9.99979 2.58057 10.2458 2.4492 10.5239C2.31782 10.8021 2.24886 11.1055 2.24714 11.4131V22.8296C2.25356 23.7232 2.61217 24.5782 3.24512 25.209C3.87808 25.8398 4.73429 26.1941 5.6279 26.1975Z"
        fill={color}
      />
    </svg>
  );
}

function DocumentIcon({ color }: { color: string }) {
  return (
    <svg
      width="27"
      height="31"
      viewBox="0 0 27 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.52568 23.6579H19.916C20.5398 23.6579 21.0454 23.1452 21.0454 22.5127C21.0454 21.8803 20.5398 21.3676 19.916 21.3676H8.5119C7.88815 21.3676 7.38251 21.8803 7.38251 22.5127C7.38251 23.1452 7.88815 23.6579 8.5119 23.6579H8.52568Z"
        fill={color}
      />
      <path
        d="M8.52536 16.9683H19.9157C20.3516 17.0171 20.7765 16.8087 21.0094 16.4321C21.2424 16.0554 21.2424 15.5769 21.0094 15.2002C20.7765 14.8236 20.3516 14.6153 19.9157 14.664H8.51159C7.93224 14.7288 7.49371 15.2251 7.49371 15.8162C7.49371 16.4072 7.93224 16.9035 8.51159 16.9683H8.52536Z"
        fill={color}
      />
      <path
        d="M8.52551 10.2788H12.864C13.4434 10.214 13.8819 9.71767 13.8819 9.12666C13.8819 8.53564 13.4434 8.03926 12.864 7.97449H8.52551C7.94615 8.03926 7.50763 8.53564 7.50763 9.12666C7.50763 9.71767 7.94615 10.214 8.52551 10.2788Z"
        fill={color}
      />
      <path
        d="M19.1997 0H7.67468C2.87475 0 0 2.91882 0 7.82776V22.2229C0 27.1185 2.87475 30.0506 7.67468 30.0506C8.22185 29.9891 8.63601 29.5175 8.63601 28.9561C8.63601 28.3946 8.22185 27.923 7.67468 27.8615C4.00644 27.8615 2.14631 25.9643 2.14631 22.2229V7.82776C2.14631 4.08636 4.00644 2.18912 7.67468 2.18912H19.1997C22.868 2.18912 24.7151 4.08636 24.7151 7.82776V22.2229C24.7151 25.9643 22.868 27.8615 19.1997 27.8615H14.9461C14.399 27.923 13.9848 28.3946 13.9848 28.9561C13.9848 29.5175 14.399 29.9891 14.9461 30.0506H19.2127C24.0257 30.0506 26.8874 27.1185 26.8874 22.2229V7.82776C26.8744 2.93209 23.9996 0 19.1997 0Z"
        fill={color}
      />
    </svg>
  );
}

function LogoutIcon({ color }: { color: string }) {
  return (
    <svg
      width="28"
      height="27"
      viewBox="0 0 28 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.3915 18.0952C17.9607 18.0952 18.4227 18.5458 18.4227 19.101V20.3302C18.4227 23.5255 15.7578 26.125 12.4809 26.125H5.95386C2.6716 26.125 0 23.5189 0 20.3159C0 19.7607 0.462006 19.3113 1.03114 19.3113C1.60028 19.3113 2.06229 19.7607 2.06229 20.3159C2.06229 22.4112 3.80854 24.1133 5.95386 24.1133H12.4809C14.6208 24.1133 16.3604 22.4164 16.3604 20.3302V19.101C16.3604 18.5458 16.8224 18.0952 17.3915 18.0952ZM26.4685 12.0556C26.8864 12.0556 27.2627 12.3012 27.422 12.6787C27.5814 13.0549 27.4917 13.4886 27.197 13.776L23.284 17.576C23.0818 17.7707 22.8194 17.87 22.5556 17.87C22.2917 17.87 22.0266 17.7707 21.8257 17.5734C21.424 17.1789 21.424 16.5427 21.8284 16.1509L23.9724 14.0686H10.38C9.81087 14.0686 9.34753 13.6179 9.34753 13.0628C9.34753 12.5076 9.81087 12.0556 10.38 12.0556H26.4685ZM12.4677 0C15.7513 0 18.4229 2.60607 18.4229 5.80913V7.02529C18.4229 7.57916 17.9609 8.02984 17.3918 8.02984C16.8227 8.02984 16.3607 7.57916 16.3607 7.02529V5.80913C16.3607 3.71382 14.6144 2.01171 12.4677 2.01171H5.94207C3.80211 2.01171 2.06256 3.7099 2.06256 5.79476V15.7422C2.06256 16.2974 1.60055 16.7481 1.03141 16.7481C0.462274 16.7481 0.00026783 16.2974 0.00026783 15.7422V5.79476C0.00026783 2.59954 2.66517 0 5.94207 0H12.4677ZM21.823 8.55615C22.2248 8.15903 22.8756 8.15642 23.2814 8.54831L24.267 9.4993C24.6727 9.89119 24.6754 10.5274 24.275 10.9219C24.0728 11.1204 23.8077 11.221 23.5425 11.221C23.28 11.221 23.0176 11.123 22.8167 10.9297L21.8297 9.9774C21.4253 9.58682 21.4226 8.94935 21.823 8.55615Z"
        fill={color}
      />
    </svg>
  );
}

const CARD_STRIDE = 320 + 16; // card width + gap

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
    /* py-3 / -my-3: da 12px de espacio vertical para el scale en hover sin afectar el layout */
    <div className='overflow-hidden py-3 -my-3'>
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
