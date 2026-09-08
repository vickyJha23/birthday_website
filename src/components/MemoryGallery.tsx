import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import  birthdayData  from "../data/birthdayData";

import "../style/MemoryGallery.css";

const MemoryGallery = ({ onComplete }: {onComplete: () => void}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedMemory, setSelectedMemory] = useState<any>(null);

  const sceneRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const touchStartX = useRef(null);

  const memories = birthdayData.memories;


  useEffect(() => {
    memories.forEach((memory) => {
      const image = new Image();
      image.src = memory.image;
    });
  }, [memories]);

  /*
  --------------------------------
  CARD ANIMATION
  --------------------------------
  */

  useEffect(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.children;

    Array.from(cards).forEach((card, index) => {
      let offset =
        index - activeIndex;

      /*
       Handle circular carousel
      */

      if (
        offset >
        memories.length / 2
      ) {
        offset -= memories.length;
      }

      if (
        offset <
        -memories.length / 2
      ) {
        offset += memories.length;
      }

      const isActive = offset === 0;

      gsap.to(card, {
        x: offset * 330,
        y: Math.abs(offset) * 20,
        scale: isActive ? 1 : 0.78,
        rotateY: offset * -18,
        rotateZ: offset * 4,
        opacity:
          Math.abs(offset) > 2
            ? 0
            : isActive
            ? 1
            : 0.55,

        zIndex:
          20 - Math.abs(offset),

        duration: 0.8,

        ease: "power3.out",
      });
    });
  }, [activeIndex, memories.length]);

  /*
  --------------------------------
  INTRO
  --------------------------------
  */

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".memory-header",
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.3,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        cardsRef.current,
        {
          opacity: 0,
          scale: 0.9,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          delay: 0.3,
          ease: "power3.out",
        }
      );
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  /*
  --------------------------------
  NAVIGATION
  --------------------------------
  */

  const nextMemory = () => {
    setActiveIndex(
      (current) =>
        (current + 1) %
        memories.length
    );
  };

  const previousMemory = () => {
    setActiveIndex(
      (current) =>
        (current - 1 + memories.length) %
        memories.length
    );
  };

  /*
  --------------------------------
  KEYBOARD
  --------------------------------
  */

  useEffect(() => {
    const handleKeyDown = (event:any) => {
      if (event.key === "ArrowRight") {
        nextMemory();
      }

      if (event.key === "ArrowLeft") {
        previousMemory();
      }

      if (event.key === "Escape") {
        setSelectedMemory(null);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  });

  /*
  --------------------------------
  TOUCH SWIPE
  --------------------------------
  */

  const handleTouchStart = (event:any) => {
    touchStartX.current =
      event.touches[0].clientX;
  };

  const handleTouchEnd = (event:any) => {
    if (touchStartX.current === null) {
      return;
    }

    const endX =
      event.changedTouches[0].clientX;

    const distance =
      touchStartX.current - endX;

    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        nextMemory();
      } else {
        previousMemory();
      }
    }

    touchStartX.current = null;
  };

  return (
    <section
      ref={sceneRef}
      className="memory-scene"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* =========================
          BACKGROUND
      ========================= */}

      <div className="memory-background" />

      <div className="memory-glow" />

      <div className="memory-stars">
        {Array.from({
          length: 50,
        }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      {/* =========================
          HEADER
      ========================= */}

      <div className="memory-header">
        <p>OUR STORY</p>

        <h1>
          Beautiful Memories
          <span> ♡</span>
        </h1>

        <div className="memory-line" />

        <span>
          Every picture holds a little
          piece of our story.
        </span>
      </div>

      {/* =========================
          CARDS
      ========================= */}

      <div
        ref={cardsRef}
        className="memory-cards"
      >
        {memories.map(
          (memory, index) => (
            <article
              key={memory.image}
              className="memory-card"
              onClick={() => {
                if (
                  index === activeIndex
                ) {
                  setSelectedMemory(
                    memory
                  );
                } else {
                  setActiveIndex(index);
                }
              }}
            >
              <div className="photo-frame">
                <img
                  src={memory.image}
                  alt={memory.title}
                  loading={
                    index === activeIndex
                      ? "eager"
                      : "lazy"
                  }
                />

                <div className="photo-overlay" />
              </div>

              <div className="memory-card-info">
                <small>
                  {memory.date}
                </small>

                <h2>
                  {memory.title}
                </h2>
              </div>
            </article>
          )
        )}
      </div>

      {/* =========================
          CONTROLS
      ========================= */}

      <div className="memory-controls">

        <button
          onClick={previousMemory}
          aria-label="Previous memory"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="memory-progress">
          <span>
            {String(
              activeIndex + 1
            ).padStart(2, "0")}
          </span>

          <div>
            <i
              style={{
                width: `${
                  ((activeIndex + 1) /
                    memories.length) *
                  100
                }%`,
              }}
            />
          </div>

          <span>
            {String(
              memories.length
            ).padStart(2, "0")}
          </span>
        </div>

        <button
          onClick={nextMemory}
          aria-label="Next memory"
        >
          <ChevronRight size={20} />
        </button>

      </div>

      {/* =========================
          CONTINUE
      ========================= */}

      <button
        className="memory-continue"
        onClick={onComplete}
      >
        Continue Our Story
        <span>→</span>
      </button>

      {/* =========================
          MODAL
      ========================= */}

      {selectedMemory && (
        <div
          className="memory-modal"
          onClick={() =>
            setSelectedMemory(null)
          }
        >
          <div
            className="memory-modal-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              className="modal-close"
              onClick={() =>
                setSelectedMemory(null)
              }
            >
              <X size={22} />
            </button>

            <img
              src={selectedMemory.image}
              alt={selectedMemory.title}
            />

            <div className="modal-text">
              <small>
                {selectedMemory.date}
              </small>

              <h2>
                {selectedMemory.title}
              </h2>

              <p>
                {selectedMemory.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MemoryGallery;