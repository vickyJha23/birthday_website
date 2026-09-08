import { useEffect, useRef } from "react";
import "../style/Fireworks.css";

interface FireworksProps {
  onComplete?: () => void;
}

interface TrailPoint {
  x: number;
  y: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
}

class FireworkParticle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  gravity: number;
  friction: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;

  constructor(
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    color: string
  ) {
    this.x = x;
    this.y = y;

    this.velocityX = velocityX;
    this.velocityY = velocityY;

    this.gravity = 0.08;
    this.friction = 0.985;

    this.alpha = 1;
    this.decay = Math.random() * 0.012 + 0.008;

    this.color = color;

    this.size = Math.random() * 2 + 1;
  }

  update(): void {
    this.velocityX *= this.friction;
    this.velocityY *= this.friction;

    this.velocityY += this.gravity;

    this.x += this.velocityX;
    this.y += this.velocityY;

    this.alpha -= this.decay;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.globalAlpha = Math.max(this.alpha, 0);

    ctx.beginPath();

    ctx.arc(
      this.x,
      this.y,
      this.size,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = this.color;

    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;

    ctx.fill();

    ctx.restore();
  }
}

class FireworkRocket {
  x: number;
  y: number;

  targetX: number;
  targetY: number;

  velocityX: number;
  velocityY: number;

  speed: number;

  trail: TrailPoint[];

  exploded: boolean;

  color: string;

  onExplode: (
    x: number,
    y: number,
    color: string
  ) => void;

  constructor(
    width: number,
    height: number,
    onExplode: (
      x: number,
      y: number,
      color: string
    ) => void
  ) {
    this.x = width / 2;
    this.y = height;

    this.targetX =
      Math.random() * width * 0.8 +
      width * 0.1;

    this.targetY =
      Math.random() * height * 0.5 +
      height * 0.08;

    this.speed = 10;

    const angle = Math.atan2(
      this.targetY - this.y,
      this.targetX - this.x
    );

    this.velocityX =
      Math.cos(angle) * this.speed;

    this.velocityY =
      Math.sin(angle) * this.speed;

    this.trail = [];

    this.exploded = false;

    this.color = `hsl(
      ${Math.random() * 360},
      100%,
      70%
    )`;

    this.onExplode = onExplode;
  }

  update(): void {
    this.trail.push({
      x: this.x,
      y: this.y,
    });

    if (this.trail.length > 8) {
      this.trail.shift();
    }

    this.x += this.velocityX;
    this.y += this.velocityY;

    this.velocityY += 0.08;

    const distance = Math.hypot(
      this.targetX - this.x,
      this.targetY - this.y
    );

    if (
      distance < 20 ||
      this.velocityY >= 0
    ) {
      this.explode();
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.beginPath();

    const firstPoint = this.trail[0];

    ctx.moveTo(
      firstPoint?.x ?? this.x,
      firstPoint?.y ?? this.y
    );

    for (const point of this.trail) {
      ctx.lineTo(point.x, point.y);
    }

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;

    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;

    ctx.stroke();

    ctx.beginPath();

    ctx.arc(
      this.x,
      this.y,
      3,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = "#ffffff";

    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ffffff";

    ctx.fill();

    ctx.restore();
  }

  explode(): void {
    if (this.exploded) return;

    this.exploded = true;

    this.onExplode(
      this.x,
      this.y,
      this.color
    );
  }
}

const Fireworks = ({
  onComplete,
}: FireworksProps) => {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    let animationFrame = 0;

    const fireworks: FireworkRocket[] = [];
    const particles: FireworkParticle[] = [];

    const resize = (): void => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener(
      "resize",
      resize
    );

    /*
     * Stars
     */
    const stars: Star[] = Array.from(
      { length: 150 },
      () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2,
        alpha: Math.random(),
      })
    );

    const drawStars = (): void => {
      stars.forEach((star) => {
        ctx.beginPath();

        ctx.arc(
          star.x,
          star.y,
          star.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(
          255,
          255,
          255,
          ${star.alpha}
        )`;

        ctx.fill();
      });
    };

    /*
     * Normal explosion
     */
    const createExplosion = (
      x: number,
      y: number,
      color: string
    ): void => {

      const count =
        90 + Math.floor(Math.random() * 50);

      for (let i = 0; i < count; i++) {
        const angle =
          (Math.PI * 2 * i) / count;

        const speed =
          Math.random() * 7 + 2;

        particles.push(
          new FireworkParticle(
            x,
            y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            color
          )
        );
      }
    };

    /*
     * Heart explosion
     */
    const launchHeart = (): void => {
      const centerX = width / 2;
      const centerY = height * 0.38;

      const scale =
        Math.min(width, height) * 0.018;

      for (let i = 0; i < 150; i++) {
        const t =
          (Math.PI * 2 * i) / 150;

        const x =
          16 * Math.pow(Math.sin(t), 3);

        const y =
          -(
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t)
          );

        particles.push(
          new FireworkParticle(
            centerX,
            centerY,
            x * scale,
            y * scale,
            "#ff5c9a"
          )
        );
      }

    };

    /*
     * Launch rocket
     */
    const launchFirework = (): void => {
      fireworks.push(
        new FireworkRocket(
          width,
          height,
          createExplosion
        )
      );
    };

    /*
     * Animation loop
     */
    const animate = (): void => {
      ctx.fillStyle =
        "rgba(4, 3, 15, 0.18)";

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      drawStars();

      /*
       * Rockets
       */
      for (
        let i = fireworks.length - 1;
        i >= 0;
        i--
      ) {
        const firework = fireworks[i];

        firework.update();
        firework.draw(ctx);

        if (firework.exploded) {
          fireworks.splice(i, 1);
        }
      }

      /*
       * Particles
       */
      for (
        let i = particles.length - 1;
        i >= 0;
        i--
      ) {
        const particle = particles[i];

        particle.update();
        particle.draw(ctx);

        if (particle.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      animationFrame =
        requestAnimationFrame(animate);
    };

    animate();

    /*
     * Opening fireworks
     */
    const launchTimers: number[] = [];

    for (let i = 0; i < 5; i++) {
      launchTimers.push(
        window.setTimeout(
          launchFirework,
          i * 500
        )
      );
    }

    /*
     * Continuous fireworks
     */
    const interval =
      window.setInterval(
        launchFirework,
        900
      );

    /*
     * First heart
     */
    const heartTimer =
      window.setTimeout(() => {
        launchHeart();
      }, 3500);

    const secondHeartTimer =
      window.setTimeout(() => {
        launchHeart();
      }, 6400);

    /*
     * Final big celebration
     */
    const finalTimers: number[] = [];

    const finalTimer =
      window.setTimeout(() => {
        for (let i = 0; i < 12; i++) {
          finalTimers.push(
            window.setTimeout(
              launchFirework,
              i * 180
            )
          );
        }

        launchHeart();
      }, 9200);

    /*
     * Finish
     */
    const completeTimer =
      window.setTimeout(() => {
        window.clearInterval(interval);

        onComplete?.();
      }, 13500);

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.clearInterval(interval);

      launchTimers.forEach(
        (timer) =>
          window.clearTimeout(timer)
      );

      finalTimers.forEach(
        (timer) =>
          window.clearTimeout(timer)
      );

      window.clearTimeout(
        heartTimer
      );

      window.clearTimeout(
        secondHeartTimer
      );

      window.clearTimeout(
        finalTimer
      );

      window.clearTimeout(
        completeTimer
      );

      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, [onComplete]);

  return (
    <section className="fireworks-scene">
      <canvas
        ref={canvasRef}
      />

      <div className="fireworks-content">
        <p>
          Tonight, the whole sky
          celebrates you
        </p>

        <h1>
          Happy Birthday
        </h1>

        <h2>
          My Love ❤️
        </h2>

        <span>
          Make a wish...
        </span>
      </div>
    </section>
  );
}

export default Fireworks;
