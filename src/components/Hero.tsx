import { useRef, useEffect } from "react";
import gsap from "gsap";
import birthdayData from "../data/birthdayData.js";
import "../style/Hero.css";
import FallingPetals from "./FallingPetals.js";
import Rose from "./Rose.js";

interface HeroI {
  onBegin: () => void;
}

const Hero = ({ onBegin }: HeroI) => {
  const particlesRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const moonRef = useRef<HTMLDivElement | null>(null);
  const petalsRef = useRef<HTMLDivElement | null>(null);
  const foregroundRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (
      !hero ||
      !particlesRef.current ||
      !moonRef.current ||
      !petalsRef.current ||
      !foregroundRef.current ||
      !contentRef.current
    ) {
      return;
    }
    const tl = gsap.timeline();
    const particlesEl = particlesRef.current;
    const moonEl = moonRef.current;
    const petalsEl = petalsRef.current;
    const foregroundEl = foregroundRef.current;
    const contentEl = contentRef.current;

    tl.fromTo(
      contentEl,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.8,
        ease: "power4.out",
      },
    );

    // Moon floating
    gsap.to(moonEl, {
      y: -15,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Particles
    gsap.to(particlesEl.children, {
      y: "random(-40, 40)",
      x: "random(-30, 30)",
      opacity: "random(0.2, 1)",
      duration: "random(3, 7)",
      repeat: -1,
      yoyo: true,
      stagger: 0.15,
      ease: "sine.inOut",
    });

    // Falling petals
    gsap.to(petalsEl.children, {
      y: "110vh",
      x: "random(-120, 120)",
      rotation: "random(180, 720)",
      duration: "random(7, 14)",
      repeat: -1,
      delay: "random(0, 8)",
      stagger: 0.4,
      ease: "none",
    });

    // Mouse parallax
    const handleMouseMove = (e: any) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      gsap.to(moonRef.current, {
        x: x * 15,
        duration: 1.5,
        ease: "power2.out",
      });

      gsap.to(foregroundEl, {
        x: x * -10,
        y: y * -5,
        duration: 1.5,
        ease: "power2.out",
      });

      gsap.to(contentEl, {
        x: x * 4,
        y: y * 2,
        duration: 1.5,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      tl.kill();
    };
  }, []);

  return (
    <section ref={heroRef} className="hero" id="home">
      {/* Background */}
      <div className="sky" />
      <div className="mountains back" />
      <div className="mountains front" />

      {/* Moon */}
      <div ref={moonRef} className="moon">
        <div className="moon-glow" />
      </div>

      {/* Stars */}
      <div ref={particlesRef} className="particles">
        {Array.from({ length: 60 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>

      {/* Falling petals */}
      {/* <div ref={petalsRef} className="petals">
        {Array.from({ length: 25 }).map((_, index) => (
          <span key={index}>🌸</span>
        ))}
      </div> */}
      <FallingPetals count={30} />

      {/* Lake */}
      <div className="lake">
        <div className="lake-reflection" />
      </div>

      {/* Lanterns */}
      <div className="lanterns">
        <span>🏮</span>
        <span>🏮</span>
        <span>🏮</span>
      </div>

      {/* Foreground flowers */}
      <div ref={foregroundRef} className="flower-foreground">
        <Rose className="rose-one" />
        <Rose className="rose-two" />
        <Rose className="rose-three" />
        <Rose className="rose-four" />
        <Rose className="rose-five" />
      </div>

      {/* Main Content */}
      <div ref={contentRef} className="hero-content">
        <p className="hero-title">{birthdayData.intro.title}</p>

        <h1 className="hero-subtitle">{birthdayData.intro.subtitle}</h1>

        <p className="hero-description">{birthdayData.intro.description}</p>

        <div className="hero-heart">♡</div>

        <button className="begin-button" onClick={onBegin}>
          Let's Begin
          <span>→</span>
        </button>
      </div>

      <div className="scroll-indicator">
        <span />
        Scroll to explore
      </div>
    </section>
  );
};

export default Hero;
