import { useEffect, useRef } from "react";
import gsap from "gsap";

import Rose from "./Rose";
import FallingPetals from "./FallingPetals";

import "../style/FlowerGarden.css";

const FlowerGarden = ({ onComplete }: {onComplete: () => void}) => {
  const sceneRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const flowersRef = useRef<HTMLDivElement | null>(null);
  const firefliesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
     const sceneEl = sceneRef.current;
     const contentEl = contentRef.current;
     const flowersEl = flowersRef.current;
     const firefliesEl = firefliesRef.current;

     if(!sceneEl || !flowersEl || !contentEl || !firefliesEl) return;



    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Initial state
      gsap.set(contentRef.current, {
        opacity: 0,
        y: 40,
      });

      gsap.set(flowersEl.children, {
        scaleY: 0,
        transformOrigin: "bottom center",
      });

      // Scene entrance
      tl.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
      });

      // Flowers grow
      tl.to(
        flowersEl.children,
        {
          scaleY: 1,
          duration: 1.4,
          stagger: 0.18,
          ease: "back.out(1.5)",
        },
        "-=.7"
      );

      // Flower sway
      gsap.to(flowersEl.children, {
        rotation: "random(-3, 3)",
        duration: "random(2.5, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });

      // Firefly movement
      gsap.to(firefliesEl.children, {
        x: "random(-80, 80)",
        y: "random(-60, 60)",
        opacity: "random(.2, 1)",
        duration: "random(2, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.15,
      });

      // Let the garden breathe before moving on
      tl.call(() => {
        setTimeout(() => {
          onComplete?.();
        }, 9000);
      });
    }, sceneRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <section
      ref={sceneRef}
      className="garden-scene"
    >
      {/* Background */}
      <div className="garden-sky" />

      <div className="garden-moon">
        <div className="garden-moon-glow" />
      </div>

      {/* Stars */}
      <div className="garden-stars">
        {Array.from({ length: 70 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      {/* Fireflies */}
      <div
        ref={firefliesRef}
        className="fireflies"
      >
        {Array.from({ length: 30 }).map(
          (_, i) => (
            <span key={i} />
          )
        )}
      </div>

      {/* Falling petals */}
      <FallingPetals count={15} />

      {/* Main content */}
      <div
        ref={contentRef}
        className="garden-content"
      >
        <p className="garden-eyebrow">
          A little garden...
        </p>

        <h1>
          Just for you <span>♡</span>
        </h1>

        <p className="garden-description">
          Just like these flowers bloom,
          <br />
          you make my world bloom too.
        </p>
      </div>

      {/* Flowers */}
      <div
        ref={flowersRef}
        className="garden-flowers"
      >
        <Rose className="garden-rose rose-a" />
        <Rose className="garden-rose rose-b" />
        <Rose className="garden-rose rose-c" />
        <Rose className="garden-rose rose-d" />
        <Rose className="garden-rose rose-e" />
        <Rose className="garden-rose rose-f" />
        <Rose className="garden-rose rose-g" />
      </div>

      {/* Ground */}
      <div className="garden-ground">
        <div className="grass grass-one" />
        <div className="grass grass-two" />
        <div className="grass grass-three" />
      </div>

      <div className="garden-bottom">
        Some things are worth waiting for...
      </div>
    </section>
  );
}

export default FlowerGarden;