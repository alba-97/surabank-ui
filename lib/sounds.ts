let tap: HTMLAudioElement | null = null;
let success: HTMLAudioElement | null = null;
let error: HTMLAudioElement | null = null;

function getOrLoad(
  ref: HTMLAudioElement | null,
  src: string,
): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!ref) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    return audio;
  }
  return ref;
}

function play(ref: HTMLAudioElement | null) {
  if (!ref) return;
  ref.currentTime = 0;
  ref.play().catch(() => {});
}

export function playTap() {
  tap = getOrLoad(tap, '/sounds/tap.wav');
  play(tap);
}

export function playSuccess() {
  success = getOrLoad(success, '/sounds/success.wav');
  play(success);
}

export function playError() {
  error = getOrLoad(error, '/sounds/error.wav');
  play(error);
}

export function playLogin() {
  playSuccess();
}

export function initSounds() {}
