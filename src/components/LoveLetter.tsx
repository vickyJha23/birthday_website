
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../style/LoveLetter.css";
import { MUSIC_STORE } from "../App";

interface LoveLetterProps {
  onComplete?: () => void;
  handleAudio: (src: string) => void
}

const LoveLetter = ({ onComplete, handleAudio }: LoveLetterProps) => {
  const sceneRef = useRef<HTMLElement | null>(null);
  const envelopeRef = useRef<HTMLDivElement | null>(null);
  const flapRef = useRef<HTMLDivElement | null>(null);
  const paperRef = useRef<HTMLDivElement | null>(null);
  const sealRef = useRef<HTMLDivElement | null>(null);
  const promptRef = useRef<HTMLDivElement | null>(null);
  const letterContentRef = useRef<HTMLDivElement | null>(null);
  const continueRef = useRef<HTMLButtonElement | null>(null);

  const [opened, setOpened] = useState<boolean>(false);
  const scoreTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".letter-header",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        envelopeRef.current,
        {
          opacity: 0,
          y: 80,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.5,
          delay: 0.4,
          ease: "back.out(1.4)",
        }
      );

      gsap.to(envelopeRef.current, {
        y: -8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sceneRef);

    return () => {
      ctx.revert();
      // Don't let the letter's music cue land after the scene is gone
      if (scoreTimerRef.current !== null) {
        window.clearTimeout(scoreTimerRef.current);
      }
    };
  }, []);

  const openLetter = (): void => {
    if (opened) return;

    setOpened(true);
    handleAudio(MUSIC_STORE.letterOpening);
    // The opening sound tails off as the piano bed rises under it
    scoreTimerRef.current = window.setTimeout(() => {
      scoreTimerRef.current = null;
      handleAudio(MUSIC_STORE.emotionalPiano);
    }, 4000);

    const tl = gsap.timeline();

    // Hide prompt
    tl.to(promptRef.current, {
      opacity: 0,
      y: 15,
      duration: 0.4,
      ease: "power2.out",
    });

    // Stop envelope floating animation
    gsap.killTweensOf(envelopeRef.current);

    // Lift envelope
    tl.to(envelopeRef.current, {
      y: -20,
      duration: 0.5,
      ease: "power2.out",
    });

    // Remove wax seal
    tl.to(
      sealRef.current,
      {
        scale: 0,
        rotation: 25,
        opacity: 0,
        duration: 0.5,
        ease: "back.in(1.5)",
      },
      "-=.2"
    );

    // Open envelope flap
    tl.to(
      flapRef.current,
      {
        rotateX: 180,
        zIndex: 1,
        duration: 1.1,
        ease: "power3.inOut",
      },
      "-=.1"
    );

    // Paper comes out
    tl.to(
      paperRef.current,
      {
        y: -190,
        scale: 1.05,
        duration: 1.4,
        ease: "power3.out",
      },
      "-=.5"
    );

    // Envelope moves down
    tl.to(
      envelopeRef.current,
      {
        y: 80,
        opacity: 0.35,
        scale: 0.9,
        duration: 1,
        ease: "power2.inOut",
      },
      "-=1"
    );

    // Expand paper
    tl.to(
      paperRef.current,
      {
        width: "min(680px, 88vw)",
        height: "min(720px, 78vh)",
        y: -30,
        duration: 1.3,
        ease: "power3.inOut",
      },
      "-=.5"
    );

    // Reveal letter
    tl.to(
      letterContentRef.current,
      {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      },
      "-=.4"
    );

    // Show continue button
    tl.to(
      continueRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      },
      "+=.8"
    );
  };

  return (
    <section ref={sceneRef} className="letter-scene">
      <div className="letter-background" />

      <div className="letter-stars">
        {Array.from({ length: 65 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className="letter-glow" />

      {/* Candles */}
      <div className="letter-candles">
        <div className="candle candle-left">
          <div className="flame" />
        </div>

        <div className="candle candle-right">
          <div className="flame" />
        </div>
      </div>

      {/* Header */}
      <div className="letter-header">
        <p>A LITTLE SOMETHING</p>

        <h1>
          A Letter
          <span> For You ♡</span>
        </h1>

        <div className="letter-header-line" />
      </div>

      {/* Envelope */}
      <div
        ref={envelopeRef}
        className={`envelope-wrapper ${opened ? "opened" : ""}`}
        onClick={openLetter}
      >
        {/* Letter paper */}
        <div ref={paperRef} className="letter-paper">
          <div className="paper-texture" />

          <div
            ref={letterContentRef}
            className="letter-content"
          >
            <p className="letter-date">
              On your special day...
            </p>

            <h2>My Love,</h2>

            <p>
              Today is your birthday, but somehow I feel like
              I'm the one who received the greatest gift.
            </p>

            <p>
              You came into my life and quietly changed so
              many things. The way I smile, the way I look
              forward to tomorrow, and the way ordinary moments
              suddenly feel special.
            </p>

            <p>
              I don't know what the future has planned for us,
              but I know one thing for sure...
            </p>

            <p className="highlight">
              I want to experience as much of it as I can
              with you.
            </p>

            <p>
              More laughter.
              <br />
              More late-night conversations.
              <br />
              More silly fights.
              <br />
              More memories.
              <br />
              More moments where I look at you and think,
              <br />
              <em>"How did I get this lucky?"</em>
            </p>

            <p>
              So today, I don't just want to wish you a Happy
              Birthday.
            </p>

            <p className="highlight">
              I want to wish us a beautiful future together.
            </p>

            <div className="letter-signature">
              <span>Forever yours,</span>
              <strong>❤️</strong>
            </div>
          </div>
        </div>

        {/* Envelope */}
        <div className="envelope">
          <div className="envelope-back" />

          <div className="envelope-front">
            <div className="envelope-fold left" />
            <div className="envelope-fold right" />
            <div className="envelope-fold bottom" />
          </div>

          <div
            ref={flapRef}
            className="envelope-flap"
          />

          <div
            ref={sealRef}
            className="wax-seal"
          >
            <span>♥</span>
          </div>
        </div>
      </div>

      {/* Click prompt */}
      <div
        ref={promptRef}
        className="letter-prompt"
      >
        <span>Click the letter</span>

        <small>
          There's something I want to tell you...
        </small>
      </div>

      {/* Continue */}
      <button
        ref={continueRef}
        className="letter-continue"
        onClick={onComplete}
      >
        There's one more thing...
        <span>→</span>
      </button>

      <div className="letter-bottom">
        Written with all my heart ❤️
      </div>
    </section>
  );
}

export default LoveLetter;
