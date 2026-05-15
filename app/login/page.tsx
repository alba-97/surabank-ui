'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { login } from '@/lib/api';
import { saveSession, isAuthenticated } from '@/lib/auth';
import { playTap, playSuccess, playError } from '@/lib/sounds';

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
        saveSession(res.data.token, res.data.name);
        playSuccess();
        router.push('/home');
      } else {
        playError();
        setError('Credenciales inválidas. Intenta de nuevo.');
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      playError();
      setError('Error de conexión. Intenta de nuevo.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-[#f9fafc]">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#005cee]/5 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
      <div className="absolute top-32 left-0 w-32 h-32 bg-[#005cee]/3 rounded-full -translate-x-16 pointer-events-none" />

      <div className="flex-1 flex flex-col px-6 pt-16 pb-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.h1
            className="text-[40px] font-semibold text-[#005cee] tracking-tight leading-none mb-3"
            style={{ fontFamily: 'var(--font-poppins)' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Surabank
          </motion.h1>
          <motion.p
            className="text-[#717e95] text-base"
            style={{ fontFamily: 'var(--font-poppins)' }}
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
            <label
              className="text-[#334154] font-medium text-base"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Email
            </label>
            <motion.div whileTap={{ scale: 0.99 }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu email"
                required
                className="w-full bg-white rounded-xl px-4 py-4 text-sm text-[#334154] placeholder-[#aaa] outline-none border-2 border-transparent focus:border-[#005cee] transition-all duration-200 shadow-[0_8px_30px_0_rgba(0,0,0,0.06)]"
                style={{ fontFamily: 'var(--font-poppins)' }}
              />
            </motion.div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-[#334154] font-medium text-base"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Contraseña
            </label>
            <motion.div className="relative" whileTap={{ scale: 0.99 }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                className="w-full bg-white rounded-xl px-4 py-4 pr-12 text-sm text-[#334154] placeholder-[#aaa] outline-none border-2 border-transparent focus:border-[#005cee] transition-all duration-200 shadow-[0_8px_30px_0_rgba(0,0,0,0.06)]"
                style={{ fontFamily: 'var(--font-poppins)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#005cee] transition-colors p-1"
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
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
                  ? 'bg-[#005cee] border-[#005cee]'
                  : 'bg-white border-[#ccc]'
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
            <span
              className="text-[#aaa] text-sm"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Recordarme
            </span>
          </motion.label>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-sm text-center bg-red-50 rounded-xl py-3 px-4"
                style={{ fontFamily: 'var(--font-poppins)' }}
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
          className="w-full bg-[#005cee] text-white font-semibold text-base rounded-2xl py-4 shadow-[0_8px_30px_0_rgba(0,92,238,0.3)] disabled:opacity-70 transition-all duration-200 cursor-pointer"
          style={{ fontFamily: 'var(--font-poppins)' }}
          whileTap={{ scale: 0.97 }}
          whileHover={{
            scale: 1.01,
            boxShadow: '0 12px 40px 0 rgba(0,92,238,0.4)',
          }}
        >
          {loading ? (
            <motion.div
              className="flex items-center justify-center gap-2"
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Ingresando...
            </motion.div>
          ) : (
            'Ingresar'
          )}
        </motion.button>

        <div className="flex justify-center mt-6">
          <div className="w-[120px] h-1 bg-[#c4c4c4]/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}
