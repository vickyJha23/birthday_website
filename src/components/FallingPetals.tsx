import { useEffect, useRef } from "react";
import gsap from "gsap";
import "../style/FallingPetals.css";

const FallingPetals = ({ count = 20 }) => {
  const petalsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const petalsEl = petalsRef.current;
    if(!petalsEl) return;
    const ctx = gsap.context(() => {

      gsap.set(petalsEl.children, {
        x: () =>
          Math.random() *
          window.innerWidth,

        y: () =>
          -50 -
          Math.random() * 200,

        rotation: () =>
          Math.random() * 360,

        scale: () =>
          0.5 +
          Math.random() * 0.8,

        opacity: () =>
          0.4 +
          Math.random() * 0.5,
      });

      gsap.to(
        petalsEl.children,
        {
          y: "110vh",

          x: () =>
            "+=" +
            (Math.random() * 300 - 150),

          rotation: () =>
            "+=" +
            (Math.random() * 720 - 360),

          duration: () =>
            7 +
            Math.random() * 7,

          delay: () =>
            Math.random() * 8,

          repeat: -1,

          ease: "none",

          stagger: {
            each: 0.35,
            repeat: -1,
          },
        }
      );

    }, petalsRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={petalsRef}
      className="falling-petals"
    >
      {Array.from({ length: count }).map(
        (_, index) => (
          <span
            key={index}
            className="petal"
          />
        )
      )}
    </div>
  );
}

export default FallingPetals;