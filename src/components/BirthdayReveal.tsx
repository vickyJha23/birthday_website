
import {
  useEffect,
  useRef,
} from "react";

import gsap from "gsap";

import  birthdayData  from "../data/birthdayData";

import "../style/BirthdayReveal.css";

import FallingPetals from "./FallingPetals";

interface BirthdayRevealProps {
  visible?: boolean;
  onComplete?: () => void;
}

const BirthdayReveal = ({
  visible = true,
  onComplete,
}: BirthdayRevealProps) => {
  const sceneRef =
    useRef<HTMLElement | null>(null);

  const heartRef =
    useRef<SVGPathElement | null>(null);

  const titleRef =
    useRef<HTMLParagraphElement | null>(null);

  const nameRef =
    useRef<HTMLHeadingElement | null>(null);

  const messageRef =
    useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (!visible) return;

    const scene = sceneRef.current;
    const heart = heartRef.current;
    const title = titleRef.current;
    const name = nameRef.current;
    const message = messageRef.current;

    if (
      !scene ||
      !heart ||
      !title ||
      !name ||
      !message
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline();

      /*
       * Initial state
       */
      gsap.set(scene, {
        opacity: 0,
        display: "flex",
      });

      gsap.set(heart, {
        strokeDashoffset: 1000,
        opacity: 0,
      });

      gsap.set(title, {
        opacity: 0,
        y: 30,
      });

      gsap.set(name, {
        opacity: 0,
        scale: 0.7,
      });

      gsap.set(message, {
        opacity: 0,
        y: 20,
      });

      /*
       * Scene fade in
       */
      timeline.to(scene, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut",
      });

      /*
       * Heart drawing
       */
      timeline.to(heart, {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 2.8,
        ease: "power2.inOut",
      });

      /*
       * Happy Birthday
       */
      timeline.fromTo(
        title,
        {
          opacity: 0,
          y: 30,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
        },
        "-=1"
      );

      /*
       * Name
       */
      timeline.fromTo(
        name,
        {
          opacity: 0,
          scale: 0.7,
          filter: "blur(15px)",
        },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "back.out(1.7)",
        },
        "-=0.5"
      );

      /*
       * Message
       */
      timeline.fromTo(
        message,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 0.75,
          y: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.5"
      );

      /*
       * Heart breathing glow
       */
      gsap.to(heart, {
        filter:
          "drop-shadow(0 0 30px rgba(255,100,170,.9))",

        duration: 2,

        repeat: -1,

        yoyo: true,

        ease: "sine.inOut",
      });

      /*
       * Hold on the message for a while
       * then move to garden
       */
      timeline.call(() => {
        onComplete?.();
      }, [], "+=5");
    }, scene);

    return () => {
      ctx.revert();
    };
  }, [visible, onComplete]);

  if (!visible) {
    return null;
  }

  return (
    <section
      ref={sceneRef}
      className="birthday-reveal"
    >
      {/* Background glow */}
      <div className="reveal-glow" />

      {/* Stars */}
      <div className="reveal-stars">
        {Array.from(
          { length: 45 }
        ).map((_, index) => (
          <span key={index} />
        ))}
      </div>

      {/* Falling petals */}
      <FallingPetals count={30} />

      {/* Main content */}
      <div className="reveal-content">
        <svg
          className="heart-svg"
          viewBox="0 0 500 450"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            ref={heartRef}
            d="
              M250 410
              C220 380 70 280 70 150
              C70 70 160 35 220 90
              L250 120
              L280 90
              C340 35 430 70 430 150
              C430 280 280 380 250 410
              Z
            "
          />
        </svg>

        <p
          ref={titleRef}
          className="reveal-title"
        >
          Happy Birthday
        </p>

        <h1
          ref={nameRef}
          className="reveal-name"
        >
          {birthdayData.name}

          <span>
            ❤️
          </span>
        </h1>

        <p
          ref={messageRef}
          className="reveal-message"
        >
          You make every ordinary
          moment feel extraordinary.
        </p>
      </div>
    </section>
  );
};

export default BirthdayReveal;
