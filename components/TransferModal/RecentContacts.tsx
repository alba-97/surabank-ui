'use client';

import { motion } from 'framer-motion';
import type { Contact } from '@/interfaces';
import Spinner from '@/components/Spinner';

const colorPairs = [
  { bg: '#e4fff0', text: '#74cc9b' },
  { bg: '#feead4', text: '#ef9c55' },
  { bg: '#f3e5ff', text: '#b946ff' },
  { bg: '#ffe0e0', text: '#ff6b6b' },
  { bg: '#e0f0ff', text: '#5b9cf5' },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface RecentContactsProps {
  contacts: Contact[];
  loading: boolean;
  recipientEmail: string;
  onSelect: (contact: Contact) => void;
}

export default function RecentContacts({
  contacts,
  loading,
  recipientEmail,
  onSelect,
}: RecentContactsProps) {
  return (
    <>
      <p className="text-fg-3 text-xs mb-3">Contactos recientes</p>
      <div className="flex gap-3 mb-5 overflow-x-auto scrollbar-hide pb-1">
        {loading ? (
          <Spinner />
        ) : contacts.length === 0 ? (
          <span className="text-fg-3 text-xs py-3">
            No hay contactos disponibles
          </span>
        ) : (
          contacts.map((c, i) => {
            const pair = colorPairs[i % colorPairs.length];
            return (
              <motion.button
                key={c.id}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer"
                whileTap={{ scale: 0.92 }}
                onClick={() => onSelect(c)}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all"
                  style={{
                    backgroundColor: pair.bg,
                    color: pair.text,
                    borderColor:
                      recipientEmail === c.email ? pair.text : 'transparent',
                  }}
                >
                  {getInitials(c.name)}
                </div>
                <span className="text-fg-2 text-[10px] whitespace-nowrap">
                  {c.name.split(' ')[0]}
                </span>
              </motion.button>
            );
          })
        )}
      </div>
    </>
  );
}
