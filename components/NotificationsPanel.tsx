'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Notification } from '@/interfaces';

interface NotificationsPanelProps {
  notifications: Notification[];
  onClose: () => void;
}

function formatTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffMin < 1) return 'Ahora';
  if (diffMin < 60) return `Hace ${diffMin}m`;
  if (diffHr < 24) return `Hace ${diffHr}h`;
  return `Hace ${diffDay}d`;
}

export default function NotificationsPanel({
  notifications,
  onClose,
}: NotificationsPanelProps) {
  return (
    <>
      <motion.div
        className="fixed inset-0 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="absolute top-16 right-4 z-50 w-72 bg-white dark:bg-[#1f2937] rounded-2xl shadow-[0_8px_30px_0_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_0_rgba(0,0,0,0.4)] overflow-hidden"
        initial={{ opacity: 0, y: -8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.95 }}
        transition={{ duration: 0.15 }}
      >
        <div className="px-4 py-3 border-b border-[#f0f4ff] dark:border-[#374151]">
          <h3 className="text-[#334154] dark:text-[#f3f4f6] text-sm font-semibold">
            Notificaciones
          </h3>
        </div>

        <div className="max-h-72 overflow-y-auto scrollbar-thin">
          {notifications.length === 0 ? (
            <p className="text-[#aaa] dark:text-[#6b7280] text-xs text-center py-6">
              No hay notificaciones
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`px-4 py-3 border-b border-[#f0f4ff] dark:border-[#374151] last:border-0 ${!n.read ? 'bg-[#f0f4ff]/50 dark:bg-[#1e293b]/50' : ''}`}
              >
                <div className="flex items-start gap-2">
                  {!n.read && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#005cee] flex-shrink-0 mt-1.5" />
                  )}
                  <div className={!n.read ? '' : 'pl-3.5'}>
                    <p className="text-[#334154] dark:text-[#f3f4f6] text-xs leading-snug">
                      {n.message}
                    </p>
                    <p className="text-[#aaa] dark:text-[#6b7280] text-[10px] mt-0.5">
                      {formatTime(n.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </>
  );
}
