import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import birthdayData from "../data/birthdayData";
import "../style/GiftBox.css";

interface GiftBoxProps {
  /** Fires the moment the gift is tapped - used to start the music on a gesture */
  onOpen?: () => void;
  /** Fires once the box has opened and the screen has faded out */
  onComplete?: () => void;
}

const SPARKLE_COUNT = 26;

const GiftBox = ({ onOpen, onComplete }: GiftBoxProps) => {
  const sceneRef = useRef<HTMLElement | null>(null);
  const boxRef = useRef<HTMLButtonElement | null>(null);
  const lidRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const raysRef = useRef<HTMLDivElement | null>(null);
  const sparklesRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const promptRef = useRef<HTMLParagraphElement | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);
  const blackoutRef = useRef<HTMLDivElement | null>(null);
  const motesRef = useRef<HTMLDivElement | null>(null);

  const [opened, setOpened] = useState<boolean>(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Glow breathes in behind the gift
      tl.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" }
      );

      // The gift drops in
      tl.fromTo(
        boxRef.current,
        { opacity: 0, y: 70, scale: 0.55, rotation: -8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 1.5,
          ease: "back.out(1.5)",
        },
        "-=1.2"
      );

      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
        "-=0.8"
      );

      tl.fromTo(
        promptRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.6"
      );

      // Idle life: the gift floats, the glow pulses, the prompt breathes
      gsap.to(boxRef.current, {
        y: -14,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.6,
      });

      gsap.to(glowRef.current, {
        scale: 1.12,
        opacity: 0.75,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(promptRef.current, {
        opacity: 0.45,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.4,
      });

      // Drifting light motes
      const motesEl = motesRef.current;
      if (motesEl) {
        gsap.set(motesEl.children, {
          x: () => Math.random() * window.innerWidth,
          y: () => Math.random() * window.innerHeight,
          scale: () => 0.4 + Math.random() * 1.1,
          opacity: () => 0.15 + Math.random() * 0.5,
        });

        gsap.to(motesEl.children, {
          y: "-=140",
          x: "+=random(-60, 60)",
          opacity: "random(0.1, 0.7)",
          duration: "random(6, 13)",
          repeat: -1,
          yoyo: true,
          stagger: 0.2,
          ease: "sine.inOut",
        });
      }
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  const openGift = (): void => {
    if (opened) return;

    setOpened(true);
    onOpen?.();

    // Idle loops would fight the opening animation
    gsap.killTweensOf(boxRef.current);
    gsap.killTweensOf(promptRef.current);
    gsap.killTweensOf(glowRef.current);

    const tl = gsap.timeline();

    tl.to([promptRef.current, headerRef.current], {
      opacity: 0,
      y: -14,
      duration: 0.4,
      ease: "power2.out",
    });

    // Anticipation - the box rattles before it gives
    tl.to(
      boxRef.current,
      {
        rotation: 4,
        duration: 0.09,
        repeat: 5,
        yoyo: true,
        ease: "sine.inOut",
      },
      "-=0.3"
    );

    tl.to(boxRef.current, {
      rotation: 0,
      scale: 0.92,
      duration: 0.2,
      ease: "power2.in",
    });

    // Lid pops off
    tl.to(
      lidRef.current,
      {
        y: -260,
        rotation: 22,
        scale: 1.05,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
      },
      "lift"
    );

    tl.to(
      boxRef.current,
      {
        scale: 1.06,
        duration: 0.5,
        ease: "back.out(2.6)",
      },
      "lift"
    );

    // Light pours out of the open box
    tl.fromTo(
      raysRef.current,
      { opacity: 0, scaleY: 0.2, scaleX: 0.5 },
      {
        opacity: 1,
        scaleY: 1,
        scaleX: 1,
        duration: 0.9,
        ease: "power2.out",
      },
      "lift"
    );

    tl.to(
      glowRef.current,
      {
        scale: 2.6,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      },
      "lift"
    );

    // Sparkle burst - they start hidden in CSS, so flash them on before flinging
    const sparklesEl = sparklesRef.current;
    if (sparklesEl) {
      tl.fromTo(
        sparklesEl.children,
        {
          x: 0,
          y: 0,
          scale: 0.3,
          rotation: 0,
          opacity: 1,
        },
        {
          x: () => gsap.utils.random(-320, 320),
          y: () => gsap.utils.random(-380, 120),
          scale: () => gsap.utils.random(0.6, 1.6),
          rotation: () => gsap.utils.random(-220, 220),
          opacity: 0,
          duration: () => gsap.utils.random(1.1, 1.9),
          ease: "power2.out",
          stagger: 0.02,
        },
        "lift"
      );
    }

    tl.to(
      bodyRef.current,
      {
        y: 40,
        scale: 0.9,
        opacity: 0,
        duration: 0.9,
        ease: "power2.in",
      },
      "lift+=0.6"
    );

    // Warm flash washes the screen out...
    tl.to(
      flashRef.current,
      {
        opacity: 1,
        duration: 0.55,
        ease: "power2.in",
      },
      "lift+=0.7"
    );

    // ...then settles into the dark that the next scene fades up from
    tl.to(
      blackoutRef.current,
      {
        opacity: 1,
        duration: 0.6,
        ease: "power2.inOut",
      },
      "lift+=1.15"
    );

    tl.call(() => {
      onComplete?.();
    });
  };

  return (
    <section ref={sceneRef} className="gift-scene">
      <div className="gift-background" />

      <div ref={motesRef} className="gift-motes">
        {Array.from({ length: 34 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      <div ref={glowRef} className="gift-glow" />

      <div ref={headerRef} className="gift-header">
        <p>SOMETHING IS WAITING FOR YOU</p>

        <h1>
          Happy Birthday
          <span> {birthdayData.name} </span>
        </h1>

        <div className="gift-header-line" />
      </div>

      <div className="gift-stage">
        <div ref={raysRef} className="gift-rays">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>

        <div ref={sparklesRef} className="gift-sparkles">
          {Array.from({ length: SPARKLE_COUNT }).map((_, i) => (
            <span key={i}>{i % 3 === 0 ? "✦" : i % 3 === 1 ? "✧" : "♡"}</span>
          ))}
        </div>

        <button
          ref={boxRef}
          type="button"
          className={`gift-box ${opened ? "opened" : ""}`}
          onClick={openGift}
          aria-label="Open your gift"
        >
          <div ref={lidRef} className="gift-lid">
            <div className="gift-bow">
              <span className="bow-loop bow-left" />
              <span className="bow-loop bow-right" />
              <span className="bow-tail bow-tail-left" />
              <span className="bow-tail bow-tail-right" />
              <span className="bow-knot" />
            </div>

            <div className="gift-lid-face">
              <div className="lid-ribbon" />
            </div>
          </div>

          <div ref={bodyRef} className="gift-body">
            <div className="body-ribbon-v" />
            <div className="body-ribbon-h" />
            <div className="body-shine" />

            <div className="gift-tag">To {birthdayData.name}</div>
          </div>

          <div className="gift-shadow" />
        </button>
      </div>

      <p ref={promptRef} className="gift-prompt">
        Tap the gift to open it
      </p>

      <div ref={flashRef} className="gift-flash" />
      <div ref={blackoutRef} className="gift-blackout" />
    </section>
  );
};

export default GiftBox;
