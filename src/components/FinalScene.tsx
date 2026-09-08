
import {
  useEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";

import birthdayData  from "../data/birthdayData";

import "../style/FinalScene.css";

interface FinalSceneProps {
  onReplay?: () => void;
}

function FinalScene({
  onReplay,
}: FinalSceneProps) {
  const sceneRef =
    useRef<HTMLElement | null>(null);

  const contentRef =
    useRef<HTMLDivElement | null>(null);

  const heartRef =
    useRef<HTMLDivElement | null>(null);

  const buttonRef =
    useRef<HTMLButtonElement | null>(null);

  const [typedText, setTypedText] =
    useState<string>("");

  const finalText =
    birthdayData.finalMessage ||
    "I LOVE YOU TODAY, TOMORROW AND IN EVERY VERSION OF OUR FUTURE.";


  /*
   * Scene entrance animation
   */
  useEffect(() => {

    const ctx = gsap.context(() => {
      const timeline =
        gsap.timeline();

      gsap.set(
        contentRef.current,
        {
          opacity: 0,
          y: 40,
        }
      );

      gsap.set(
        buttonRef.current,
        {
          opacity: 0,
          y: 20,
        }
      );

      /*
       * Main content reveal
       */
      timeline.to(
        contentRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 2,
          ease: "power3.out",
        }
      );

      /*
       * Heart breathing animation
       */
      gsap.to(
        heartRef.current,
        {
          scale: 1.15,
          duration: 1.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }
      );

      /*
       * Replay button
       */
      timeline.to(
        buttonRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.8"
      );
    }, sceneRef);

    return () => {
      ctx.revert();
    };
  }, []);

  /*
   * Typewriter effect
   */
  useEffect(() => {
    let index = 0;

    setTypedText("");

    const timer =
      window.setInterval(() => {
        setTypedText(
          finalText.slice(
            0,
            index + 1
          )
        );

        index++;

        if (
          index >= finalText.length
        ) {
          window.clearInterval(
            timer
          );
        }
      }, 45);

    return () => {
      window.clearInterval(timer);
    };
  }, [finalText]);

  /*
   * Replay
   */
  const handleReplay = (): void => {
    onReplay?.();
  };

  return (
    <section
      ref={sceneRef}
      className="final-scene"
    >
      {/* Background noise */}
      <div className="final-noise" />

      {/* Stars */}
      <div className="final-stars">
        {Array.from(
          { length: 100 }
        ).map((_, index) => (
          <span
            key={index}
          />
        ))}
      </div>

      {/* Center glow */}
      <div className="final-glow" />

      {/* Main content */}
      <div
        ref={contentRef}
        className="final-content"
      >
        <div className="final-small">
          And if I could wish for
          anything...
        </div>

        <div
          ref={heartRef}
          className="final-heart"
        >
          ♥
        </div>

        <p className="final-label">
          My favorite person
        </p>

        <h1>
          {birthdayData.name}
        </h1>

        <div className="final-line" />

        <p className="final-message">
          {typedText}
          <span className="cursor">
            |
          </span>
        </p>

        <p className="final-signature">
          Forever yours ❤️
        </p>

        <button
          ref={buttonRef}
          className="replay-button"
          onClick={handleReplay}
        >
          <span>↻</span>

          Replay Our Story
        </button>
      </div>

      <div className="final-bottom">
        Made with love, just for you
      </div>
    </section>
  );
}

export default FinalScene;

