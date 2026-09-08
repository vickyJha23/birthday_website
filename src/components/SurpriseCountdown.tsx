import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../style/SurpriseCountdown.css";

interface SurpriseCountdownProps {
  onComplete?: () => void;
}

const SurpriseCountdown = ({
  onComplete,
}: SurpriseCountdownProps) => {
  const sceneRef = useRef<HTMLElement | null>(null);
  const numberRef = useRef<HTMLDivElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const wishRef = useRef<HTMLParagraphElement | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);

  const [count, setCount] = useState<number>(3);


  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial scene animation
      gsap.fromTo(
        subtitleRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        numberRef.current,
        {
          opacity: 0,
          scale: 0.5,
          filter: "blur(20px)",
        },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          delay: 0.4,
          ease: "back.out(1.7)",
        }
      );

      gsap.fromTo(
        wishRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 0.6,
          y: 0,
          duration: 1,
          delay: 0.8,
          ease: "power2.out",
        }
      );
    }, sceneRef);

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {

    if (!numberRef.current) return;

    // Number animation
    gsap.fromTo(
      numberRef.current,
      {
        scale: 1.5,
        opacity: 0,
        filter: "blur(15px)",
      },
      {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.65,
        ease: "power3.out",
      }
    );

    // Pulse
    gsap.to(numberRef.current, {
      scale: 1.08,
      duration: 0.35,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });

    // Finish after 3 → 2 → 1
    if (count === 1) {
      const timer = window.setTimeout(() => {
        finishCountdown();
      }, 900);

      return () => {
        window.clearTimeout(timer);
      };
    }

    const timer = window.setTimeout(() => {
      setCount((current) => current - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [count]);

  const finishCountdown = (): void => {
    if (!flashRef.current) {
      onComplete?.();
      return;
    }

    const tl = gsap.timeline();

    // Final flash
    tl.to(flashRef.current, {
      opacity: 1,
      duration: 0.35,
      ease: "power2.in",
    });

    tl.to(flashRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    });

    tl.call(() => {
      onComplete?.();
    });
  };

  return (
    <section
      ref={sceneRef}
      className="countdown-scene"
    >
      {/* Background */}
      <div className="countdown-background" />

      <div className="countdown-glow" />

      {/* Stars */}
      <div className="countdown-stars">
        {Array.from({ length: 80 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>

      {/* Main content */}
      <div className="countdown-content">
        <p
          ref={subtitleRef}
          className="countdown-subtitle"
        >
          One last surprise...
        </p>

        <div
          ref={numberRef}
          className="countdown-number"
        >
          {count}
        </div>

        <p
          ref={wishRef}
          className="countdown-wish"
        >
          Close your eyes...
          <br />
          Make a wish ❤️
        </p>
      </div>

      {/* Flash */}
      <div
        ref={flashRef}
        className="countdown-flash"
      />
    </section>
  );
}

export default SurpriseCountdown;
