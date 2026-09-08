import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import "../style/SceneTransition.css";

/*
 * Fades a scene's content in once it mounts. The darkness between scenes is
 * owned by App's veil, so there is no overlay here - by the time this runs the
 * screen is already dark and the veil is on its way out.
 */
const SceneTransition = ({
  sceneKey,
  children,
}: {
  sceneKey: any;
  children: ReactNode;
}) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapperRef.current,
        {
          opacity: 0,
          scale: 1.035,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, [sceneKey]);

  return (
    <div ref={wrapperRef} className="scene-wrapper">
      {children}
    </div>
  );
};

export default SceneTransition;
