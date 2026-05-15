let loginSound: { play: () => void } | null = null;
let tapSound: { play: () => void } | null = null;
let successSound: { play: () => void } | null = null;
let errorSound: { play: () => void } | null = null;

function createBeep(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.3,
): () => void {
  return () => {
    if (typeof window === 'undefined') return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {}
  };
}

function createSuccessChime(): () => void {
  return () => {
    if (typeof window === 'undefined') return;
    try {
      const ctx = new AudioContext();
      const notes = [523, 659, 784];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + i * 0.12 + 0.2,
        );
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.2);
      });
    } catch {}
  };
}

export function initSounds() {
  if (typeof window === 'undefined') return;
  loginSound = { play: createSuccessChime() };
  tapSound = { play: createBeep(440, 0.08, 'sine', 0.15) };
  successSound = { play: createSuccessChime() };
  errorSound = { play: createBeep(220, 0.2, 'sawtooth', 0.2) };
}

export function playLogin() {
  loginSound?.play();
}

export function playTap() {
  tapSound?.play();
}

export function playSuccess() {
  successSound?.play();
}

export function playError() {
  errorSound?.play();
}
