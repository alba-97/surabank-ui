'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { login } from '@/services/api';
import { saveSession, isAuthenticated } from '@/services/auth';
import { playTap, playError } from '@/services/sounds';
import Spinner from '@/components/Spinner';
import ThemeToggle from '@/components/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) router.replace('/home');
  }, [router]);

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    setError('');
    setLoading(true);
    playTap();

    try {
      const res = await login(email, password);
      if (res.success) {
        saveSession(res.data.token, res.data.name, remember);
        router.push('/home');
        return;
      }
      playError();
      setError('Credenciales inválidas. Intenta de nuevo.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } catch {
      playError();
      setError('Error de conexión. Intenta de nuevo.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
    setLoading(false);
  };

  if (loading) return <Spinner />;

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-page">
      <ThemeToggle />
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
      <div className="absolute top-32 left-0 w-32 h-32 bg-primary/[0.03] rounded-full -translate-x-16 pointer-events-none" />

      <div className="flex-1 flex flex-col px-6 pt-16 pb-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.h1
            className="text-[40px] font-semibold text-primary tracking-tight leading-none mb-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Surabank
          </motion.h1>
          <motion.p
            className="text-fg-2 text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Comienza a manejar tu vida financiera
          </motion.p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={
            shake ? { x: [-8, 8, -8, 8, -4, 4, 0] } : { opacity: 1, y: 0 }
          }
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col gap-2">
            <label className="text-fg font-medium text-base">Email</label>
            <motion.div whileTap={{ scale: 0.99 }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu email"
                required
                className="w-full bg-surface rounded-xl px-4 py-4 text-sm text-fg placeholder-fg-3 outline-none border-2 border-field-border focus:border-primary transition-all duration-200 shadow-[0_8px_30px_0_rgba(0,0,0,0.06)]"
              />
            </motion.div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-fg font-medium text-base">Contraseña</label>
            <motion.div className="relative" whileTap={{ scale: 0.99 }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                className="w-full bg-surface rounded-xl px-4 py-4 pr-12 text-sm text-fg placeholder-fg-3 outline-none border-2 border-field-border focus:border-primary transition-all duration-200 shadow-[0_8px_30px_0_rgba(0,0,0,0.06)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-40 hover:opacity-80 transition-opacity"
              >
                <Image
                  src={
                    showPassword ? '/icons/eye-hide.svg' : '/icons/eye-show.svg'
                  }
                  width={20}
                  height={20}
                  alt={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                  className="dark:invert"
                />
              </button>
            </motion.div>
          </div>

          <motion.label
            className="flex items-center gap-2 cursor-pointer w-fit"
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setRemember((v) => !v);
              playTap();
            }}
          >
            <div
              className={`w-[18px] h-[18px] rounded-sm border-2 flex items-center justify-center transition-all duration-200 ${
                remember
                  ? 'bg-primary border-primary'
                  : 'bg-surface border-[#ccc] dark:border-divider-2'
              }`}
            >
              <AnimatePresence>
                {remember && (
                  <motion.svg
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    fill="none"
                  >
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
            </div>
            <span className="text-fg-3 text-sm">Recordarme</span>
          </motion.label>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-sm text-center bg-red-50 rounded-xl py-3 px-4"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>

      <div className="px-6 pb-8">
        <motion.button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-primary text-white font-semibold text-base rounded-2xl py-4 shadow-[0_8px_30px_0_rgba(0,92,238,0.3)] disabled:opacity-70 transition-all duration-200 cursor-pointer"
          whileTap={{ scale: 0.97 }}
          whileHover={{
            scale: 1.01,
            boxShadow: '0 12px 40px 0 rgba(0,92,238,0.4)',
          }}
        >
          Ingresar
        </motion.button>
        <div className="flex justify-center mt-6">
          <div className="w-[120px] h-1 bg-[#c4c4c4]/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}
