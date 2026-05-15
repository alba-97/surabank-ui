'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/theme';
import { playTap } from '@/services/sounds';

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();

  return (
    <motion.button
      className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-surface shadow-[0_2px_12px_0_rgba(0,0,0,0.1)] dark:shadow-[0_2px_12px_0_rgba(0,0,0,0.4)] cursor-pointer"
      whileTap={{ scale: 0.88 }}
      onClick={() => {
        playTap();
        toggle();
      }}
      aria-label="Cambiar modo"
    >
      {dark ? (
        <Image src="/icons/sun.svg" width={17} height={17} alt="Modo claro" />
      ) : (
        <Image src="/icons/moon.svg" width={17} height={17} alt="Modo oscuro" />
      )}
    </motion.button>
  );
}
