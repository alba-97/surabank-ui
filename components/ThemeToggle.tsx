'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/theme';
import { playTap } from '@/services/sounds';

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();

  return (
    <motion.button
      className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-[#1f2937] shadow-[0_2px_12px_0_rgba(0,0,0,0.1)] dark:shadow-[0_2px_12px_0_rgba(0,0,0,0.4)] cursor-pointer"
      whileTap={{ scale: 0.88 }}
      onClick={() => {
        playTap();
        toggle();
      }}
      aria-label="Cambiar modo"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </motion.button>
  );
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        stroke="#334154"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" stroke="#f3f4f6" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke="#f3f4f6"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
