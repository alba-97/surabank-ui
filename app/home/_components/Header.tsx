'use client';

import { type RefObject, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { playTap } from '@/services/sounds';
import { markNotificationsRead } from '@/services/api';
import { getToken } from '@/services/auth';
import NotificationsPanel from '@/components/NotificationsPanel';
import type { Notification } from '@/interfaces';

interface HeaderProps {
  name: string;
  accountBalance: string;
  balancesVisible: boolean;
  onToggleBalances: () => void;
  searchOpen: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onToggleSearch: () => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  notifications?: Notification[];
  onNotificationsRead?: () => void;
}

export default function Header({
  name,
  accountBalance,
  balancesVisible,
  onToggleBalances,
  searchOpen,
  searchQuery,
  onSearchChange,
  onToggleSearch,
  searchInputRef,
  notifications = [],
  onNotificationsRead,
}: HeaderProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleBellClick = async () => {
    playTap();
    if (!panelOpen && unreadCount > 0) {
      const token = getToken();
      if (token) {
        await markNotificationsRead(token);
        onNotificationsRead?.();
      }
    }
    setPanelOpen((v) => !v);
  };

  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar movimiento..."
              className="w-full bg-[#f0f4ff] dark:bg-[#1e293b] rounded-xl px-4 py-2.5 text-[#334154] dark:text-[#f3f4f6] outline-none text-sm"
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
            <p className="text-[#616e7c] dark:text-[#9ca3af] text-base font-medium leading-tight">
              Hola
            </p>
            <h1 className="text-[#334154] dark:text-[#f3f4f6] text-[22px] font-semibold leading-tight">
              {name}
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[#616e7c] dark:text-[#9ca3af] text-xs">Saldo</span>
              <span className="text-[#334154] dark:text-[#f3f4f6] text-xs font-semibold">
                {balancesVisible ? `$${accountBalance}` : '• • •'}
              </span>
              <button
                className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                onClick={onToggleBalances}
              >
                {balancesVisible ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      stroke="#616e7c"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="#616e7c"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                      stroke="#616e7c"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="1"
                      y1="1"
                      x2="23"
                      y2="23"
                      stroke="#616e7c"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 shrink-0">
        <motion.button
          className="w-10 h-10 flex items-center justify-center cursor-pointer text-[#334154] dark:text-[#f3f4f6]"
          whileTap={{ scale: 0.9 }}
          onClick={onToggleSearch}
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
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
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
                <Image
                  src="/icons/glass.svg"
                  width={19}
                  height={19}
                  alt="Buscar"
                />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        {!searchOpen && (
          <div className="relative">
            <motion.button
              className="w-10 h-10 flex items-center justify-center cursor-pointer"
              whileTap={{ scale: 0.9 }}
              onClick={handleBellClick}
            >
              <Image
                src="/icons/notifications.svg"
                width={18}
                height={21}
                alt="Notificaciones"
              />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#005cee] rounded-full text-white text-[9px] font-semibold flex items-center justify-center leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {panelOpen && (
                <NotificationsPanel
                  notifications={notifications}
                  onClose={() => setPanelOpen(false)}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
