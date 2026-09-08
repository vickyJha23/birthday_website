import { useEffect, useRef } from "react";

interface AudioManagerProps {
  audio: string;
  play: boolean;
  loop?: boolean;
  volume: number;
  /** Crossfade / fade-in / fade-out length in ms */
  fadeDuration?: number;
}

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

// Equal-power curves: the pair keeps perceived loudness steady through a crossfade
const curveIn = (t: number): number => Math.sin((t * Math.PI) / 2);
const curveOut = (t: number): number => Math.cos((t * Math.PI) / 2);

const AudioManager = ({
  audio,
  play = false,
  loop = false,
  volume,
  fadeDuration = 1400,
}: AudioManagerProps) => {
  // Two decks so a new track can rise while the old one falls
  const deckA = useRef<HTMLAudioElement | null>(null);
  const deckB = useRef<HTMLAudioElement | null>(null);
  const activeDeck = useRef<0 | 1>(0);

  // Track which src each deck holds, so the same track never restarts
  const deckSrc = useRef<[string, string]>(["", ""]);

  const fades = useRef(new Map<HTMLAudioElement, number>());
  const targetVolume = useRef(volume);

  const stopFade = (el: HTMLAudioElement): void => {
    const frame = fades.current.get(el);
    if (frame !== undefined) {
      cancelAnimationFrame(frame);
      fades.current.delete(el);
    }
  };

  const fadeIn = (el: HTMLAudioElement, duration: number): void => {
    stopFade(el);
    const from = el.volume;
    const start = performance.now();
    const step = (now: number) => {
      const t = clamp01((now - start) / duration);
      const to = targetVolume.current;
      el.volume = clamp01(from + (to - from) * curveIn(t));
      if (t < 1) fades.current.set(el, requestAnimationFrame(step));
      else fades.current.delete(el);
    };
    fades.current.set(el, requestAnimationFrame(step));
  };

  const fadeOut = (
    el: HTMLAudioElement,
    duration: number,
    onDone?: () => void
  ): void => {
    stopFade(el);
    if (el.paused || el.volume === 0) {
      el.volume = 0;
      onDone?.();
      return;
    }
    const from = el.volume;
    const start = performance.now();
    const step = (now: number) => {
      const t = clamp01((now - start) / duration);
      el.volume = clamp01(from * curveOut(t));
      if (t < 1) {
        fades.current.set(el, requestAnimationFrame(step));
      } else {
        fades.current.delete(el);
        onDone?.();
      }
    };
    fades.current.set(el, requestAnimationFrame(step));
  };

  // Keep the live volume target in sync; apply it straight away when idle
  useEffect(() => {
    targetVolume.current = volume;
    const el = (activeDeck.current === 0 ? deckA : deckB).current;
    if (el && !fades.current.has(el) && !el.paused) {
      el.volume = clamp01(volume);
    }
  }, [volume]);

  useEffect(() => {
    const current = (activeDeck.current === 0 ? deckA : deckB).current;
    const idle = (activeDeck.current === 0 ? deckB : deckA).current;
    if (!current || !idle) return;

    // Stopped, or nothing selected: ease both decks down instead of cutting
    if (!play || !audio) {
      fadeOut(current, fadeDuration, () => current.pause());
      fadeOut(idle, fadeDuration, () => idle.pause());
      return;
    }

    // Same track: resume where it left off rather than reloading it
    if (deckSrc.current[activeDeck.current] === audio) {
      current.loop = loop;
      if (current.paused) {
        current.volume = 0;
        current
          .play()
          .then(() => fadeIn(current, fadeDuration))
          .catch(() => {});
      } else {
        fadeIn(current, fadeDuration);
      }
      return;
    }

    // New track: bring it up on the idle deck while the old one falls away
    const idleIndex = activeDeck.current === 0 ? 1 : 0;
    stopFade(idle);
    idle.src = audio;
    idle.loop = loop;
    idle.volume = 0;
    idle.currentTime = 0;
    deckSrc.current[idleIndex] = audio;

    idle
      .play()
      .then(() => fadeIn(idle, fadeDuration))
      .catch(() => {});

    fadeOut(current, fadeDuration, () => current.pause());
    activeDeck.current = idleIndex;
  }, [audio, play, loop, fadeDuration]);

  // Silence everything on unmount
  useEffect(() => {
    const fadeMap = fades.current;
    const decks = [deckA, deckB];
    return () => {
      decks.forEach((ref) => {
        const el = ref.current;
        if (!el) return;
        const frame = fadeMap.get(el);
        if (frame !== undefined) cancelAnimationFrame(frame);
        el.pause();
      });
      fadeMap.clear();
    };
  }, []);

  return (
    <>
      <audio ref={deckA} preload="auto" />
      <audio ref={deckB} preload="auto" />
    </>
  );
};

export default AudioManager;
