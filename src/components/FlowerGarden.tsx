import { useEffect, useRef } from "react";
import gsap from "gsap";

import Rose from "./Rose";
import FallingPetals from "./FallingPetals";

import "../style/FlowerGarden.css";

const FlowerGarden = ({ onComplete }: {onComplete: () => void}) => {
  const sceneRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const flowersRef = useRef<HTMLDivElement | null>(null);
  const farFlowersRef = useRef<HTMLDivElement | null>(null);
  const firefliesRef = useRef<HTMLDivElement | null>(null);
  const butterfliesRef = useRef<HTMLDivElement | null>(null);
  const shootingRef = useRef<HTMLDivElement | null>(null);
  const grassRef = useRef<HTMLDivElement | null>(null);
  const skyRef = useRef<HTMLDivElement | null>(null);

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

      // The distant row wakes first, so the near flowers grow in front of it
      const farEl = farFlowersRef.current;
      if (farEl) {
        tl.fromTo(
          farEl.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1.6,
            stagger: 0.12,
            ease: "power2.out",
          },
          "-=1.1"
        );
      }

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

      // Foreground grass leans in the breeze
      const grassEl = grassRef.current;
      if (grassEl) {
        gsap.to(grassEl.children, {
          rotation: "random(-7, 7)",
          duration: "random(2.4, 4.5)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.08,
          transformOrigin: "bottom center",
        });
      }

      // Butterflies wander across the garden and loop back around
      const butterfliesEl = butterfliesRef.current;
      if (butterfliesEl) {
        gsap.utils.toArray<HTMLElement>(butterfliesEl.children).forEach(
          (bfly, i) => {
            gsap.fromTo(
              bfly,
              { x: "-12vw" },
              {
                x: "112vw",
                duration: 22 + i * 6,
                repeat: -1,
                delay: i * 5,
                ease: "none",
              }
            );

            // Bobbing and banking, on their own rhythm so it reads as fluttering
            gsap.to(bfly, {
              y: `random(-${34 + i * 10}, ${34 + i * 10})`,
              rotation: "random(-14, 14)",
              duration: "random(1.6, 3)",
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.6,
            });
          }
        );
      }

      // The occasional shooting star, on a long random wait
      const shootingEl = shootingRef.current;
      if (shootingEl) {
        gsap.utils.toArray<HTMLElement>(shootingEl.children).forEach(
          (star, i) => {
            const streak = () => {
              gsap.fromTo(
                star,
                { x: 0, y: 0, opacity: 0 },
                {
                  x: 320,
                  y: 190,
                  opacity: 1,
                  duration: 0.55,
                  ease: "power1.in",
                  onComplete: () => {
                    gsap.to(star, {
                      opacity: 0,
                      duration: 0.3,
                      onComplete: () =>
                        gsap.delayedCall(
                          gsap.utils.random(4, 11),
                          streak
                        ),
                    });
                  },
                }
              );
            };

            gsap.delayedCall(2.5 + i * 6, streak);
          }
        );
      }

      // Parallax, the same language the hero scene uses
      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        gsap.to(skyRef.current, {
          x: x * -14,
          y: y * -8,
          duration: 1.5,
          ease: "power2.out",
        });

        gsap.to(farFlowersRef.current, {
          x: x * -18,
          duration: 1.5,
          ease: "power2.out",
        });

        gsap.to(grassRef.current, {
          x: x * 26,
          duration: 1.5,
          ease: "power2.out",
        });

        gsap.to(contentRef.current, {
          x: x * 6,
          y: y * 3,
          duration: 1.5,
          ease: "power2.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);

      // Let the garden breathe before moving on
      tl.call(() => {
        setTimeout(() => {
          onComplete?.();
        }, 9000);
      });

      // gsap runs this when the context is reverted
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, sceneRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <section
      ref={sceneRef}
      className="garden-scene"
    >
      {/* Background */}
      <div ref={skyRef} className="garden-sky-layer">
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

        {/* Shooting stars */}
        <div ref={shootingRef} className="garden-shooting">
          <span className="shooting-star shooting-one" />
          <span className="shooting-star shooting-two" />
        </div>
      </div>

      {/* Distant flowers, sitting behind the ground for depth */}
      <div ref={farFlowersRef} className="garden-far-flowers">
        <Rose className="garden-rose-far rose-far-a" />
        <Rose className="garden-rose-far rose-far-b" />
        <Rose className="garden-rose-far rose-far-c" />
        <Rose className="garden-rose-far rose-far-d" />
        <Rose className="garden-rose-far rose-far-e" />
        <Rose className="garden-rose-far rose-far-f" />
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

      {/* Butterflies */}
      <div ref={butterfliesRef} className="garden-butterflies">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className={`butterfly butterfly-${i + 1}`}>
            <i className="wing wing-left" />
            <i className="wing wing-right" />
            <i className="butterfly-body" />
          </span>
        ))}
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

      {/* Foreground grass silhouette */}
      <div ref={grassRef} className="garden-foreground-grass">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className="garden-bottom">
        Some things are worth waiting for...
      </div>
    </section>
  );
}

export default FlowerGarden;
