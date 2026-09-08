import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import "../style/SceneTransition.css";

const SceneTransition = ({ sceneKey, children }: {sceneKey: any, children: ReactNode}) => {
  const wrapperRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // New scene starts hidden
      gsap.set(wrapperRef.current, {
        opacity: 0,
      });

      gsap.set(overlayRef.current, {
        opacity: 1,
      });

      // Black overlay slowly disappears
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
      });

      // Scene fades in
      tl.to(
        wrapperRef.current,
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.4"
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, [sceneKey]);

  return (
    <div
      ref={wrapperRef}
      className="scene-wrapper"
    >
      {children}

      <div
        ref={overlayRef}
        className="scene-overlay"
      />
    </div>
  );
}

export default SceneTransition;