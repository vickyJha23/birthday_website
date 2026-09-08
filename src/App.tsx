import { useCallback, useEffect, useRef, useState } from "react";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import BirthdayReveal from "./components/BirthdayReveal";
import FlowerGarden from "./components/FlowerGarden";
import MemoryGallery from "./components/MemoryGallery";
import LoveLetter from "./components/LoveLetter";
import SurpriseCountdown from "./components/SurpriseCountdown";
import "./index.css";
import Fireworks from "./components/Fireworks";
import FinalScene from "./components/FinalScene";
import AudioManager from "./components/AudioManager";

// import songs

import softPiano from "./assets/music/soft_piano.mp3";
import pianoSolo from "./assets/music/piano_solo.mp3";
import nonstalgia from "./assets/music/nonstalgia.mp3";
import letterOpening from "./assets/music/letter_opening.mp3";
import heartbeat from "./assets/music/heartbeat-01a.mp3";
import count_down from "./assets/music/count_down.mp3";
import firework from "./assets/music/firework.mp3";
import emotionalPiano from "./assets/music/emotional_piano.mp3";
import dreamer from "./assets/music/dreamer.mp3";
import SceneTransition from "./components/SceneTransition";
import GiftBox from "./components/GiftBox";



export const MUSIC_STORE = {
   pianoSolo: pianoSolo,
   softPiano: softPiano,
   nonstalgia: nonstalgia,
   letterOpening: letterOpening,
   heartbeat: heartbeat,
   fireworks: firework,
   countDown: count_down,
   emotionalPiano: emotionalPiano,
   dreamer: dreamer
}

// Short one-shots that are timed to what's on screen; everything else is a
// looping bed so a scene never falls into silence mid-way.
const ONE_SHOT_TRACKS = new Set<string>([
  MUSIC_STORE.letterOpening,
  MUSIC_STORE.countDown,
]);

// How long one track takes to hand over to the next
const CROSSFADE_MS = 1600;

/*
 * Scene changes run through one veil: the old scene dims out, the swap happens
 * behind full darkness, the screen holds there for a beat, then the new scene
 * rises. The hold is what stops the site feeling like it is rushing you along.
 */
const VEIL_OUT_MS = 750;
const VEIL_HOLD_MS = 450;
const VEIL_IN_MS = 1200;

const App = () => {
  const [scene, setScene] = useState<string>("gift");
  const [volume] = useState(0.5);
  const [audio, setAudio] = useState<string>("");
  const [loop, setLoop] = useState<boolean>(true);
  const [play, setPlay] = useState<boolean>(false);

  const handleAudio = useCallback((src: string) => {
    setAudio(src);
    setLoop(!ONE_SHOT_TRACKS.has(src));
  }, []);

  const handlePlay = useCallback((ply: boolean) => {
    setPlay(ply);
  }, []);

  const veilRef = useRef<HTMLDivElement | null>(null);
  const swapPending = useRef<boolean>(false);
  const veilTimers = useRef<number[]>([]);

  useEffect(() => {
    const timers = veilTimers.current;
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  /*
   * `immediate` is for scenes that already faded themselves to black (the gift
   * box does). The veil takes over at full opacity so there is no double fade.
   */
  const goToScene = useCallback((next: string, immediate = false) => {
    const veil = veilRef.current;

    if (!veil) {
      setScene(next);
      return;
    }

    // Only guard the dimming half. Once the new scene is up the veil is just
    // lifting, and a change asked for then should take over rather than vanish.
    if (swapPending.current) return;
    swapPending.current = true;

    veilTimers.current.forEach((id) => window.clearTimeout(id));
    veilTimers.current = [];

    const outMs = immediate ? 0 : VEIL_OUT_MS;

    veil.style.transitionDuration = `${outMs}ms`;
    veil.style.opacity = "1";

    veilTimers.current.push(
      window.setTimeout(() => {
        setScene(next);
        swapPending.current = false;

        veilTimers.current.push(
          window.setTimeout(() => {
            veil.style.transitionDuration = `${VEIL_IN_MS}ms`;
            veil.style.opacity = "0";
          }, VEIL_HOLD_MS)
        );
      }, outMs)
    );
  }, []);

  const toReveal = useCallback(() => {
    goToScene("reveal");
    handleAudio(MUSIC_STORE.softPiano);
    handlePlay(true);
  }, [goToScene, handleAudio, handlePlay]);

  const toGarden = useCallback(() => {
    goToScene("garden");
    handleAudio(MUSIC_STORE.pianoSolo);
  }, [goToScene, handleAudio]);

  const toMemories = useCallback(() => {
    goToScene("memories");
    handleAudio(MUSIC_STORE.emotionalPiano);
  }, [goToScene, handleAudio]);

  const toLoveLetter = useCallback(() => {
    goToScene("loveletter");
  }, [goToScene]);

  const toCountdown = useCallback(() => {
    goToScene("countdown");
    handleAudio(MUSIC_STORE.countDown);
  }, [goToScene, handleAudio]);

  const toFireworks = useCallback(() => {
    goToScene("fireworks");
    handleAudio(MUSIC_STORE.fireworks);
  }, [goToScene, handleAudio]);

  const toFinal = useCallback(() => {
    goToScene("final");
    handleAudio(MUSIC_STORE.nonstalgia);
  }, [goToScene, handleAudio]);

  const toGiftAgain = useCallback(() => {
    goToScene("gift");
    handlePlay(false);
  }, [goToScene, handlePlay]);

  const onGiftOpened = useCallback(() => {
    // Tapping the gift is the first gesture, so audio can start here
    handleAudio(MUSIC_STORE.dreamer);
    handlePlay(true);
  }, [handleAudio, handlePlay]);

  // The gift box fades itself to black, so the veil takes over already covered
  const toHero = useCallback(() => {
    goToScene("hero", true);
  }, [goToScene]);

  return (
    <main className="">
      <AudioManager
        volume={volume}
        audio={audio}
        loop={loop}
        play={play}
        fadeDuration={CROSSFADE_MS}
      />
      {scene === "gift" && (
        <SceneTransition sceneKey="gift">
          <GiftBox onOpen={onGiftOpened} onComplete={toHero} />
        </SceneTransition>
      )}

      {scene === "hero" && (
         <SceneTransition sceneKey="hero">
             <>
          <Navbar />
          <Hero onBegin={toReveal} />
        </>
         </SceneTransition>
      )}

      {scene === "reveal" && (
         <SceneTransition sceneKey="reveal" >
             <BirthdayReveal visible={true} onComplete={toGarden} />
         </SceneTransition>
      )}

      {scene === "garden" && (
        <SceneTransition sceneKey="garden">
          <FlowerGarden onComplete={toMemories} />
        </SceneTransition>
      )}

      {scene === "memories" && (
        <SceneTransition sceneKey="memmorie">
          <MemoryGallery onComplete={toLoveLetter} />
        </SceneTransition>
      )}

      {scene === "loveletter" && (
        <SceneTransition sceneKey="loveletter">
            <LoveLetter handleAudio={handleAudio} onComplete={toCountdown} />
        </SceneTransition>
      )}

      {scene === "countdown" && (
         <SceneTransition sceneKey="countdown">
             <SurpriseCountdown onComplete={toFireworks} />
         </SceneTransition>
      )}

      {scene === "fireworks" && (
        <SceneTransition sceneKey="fireworks">
          <Fireworks onComplete={toFinal} />
        </SceneTransition>
      )}

      {scene === "final" && <SceneTransition sceneKey="final">
              <FinalScene onReplay={toGiftAgain} />
          </SceneTransition>}

      <div ref={veilRef} className="scene-veil" />
    </main>
  );
};

export default App;
