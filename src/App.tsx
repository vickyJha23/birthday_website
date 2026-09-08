import { useState } from "react";
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

const App = () => {
  const [scene, setScene] = useState<string>("hero");
  const [volume, setVolume] = useState(0.5);
  const [audio, setAudio] = useState<string>("");
  const [loop, setLoop] = useState<boolean>(false);
  const [play, setPlay] = useState<boolean>(false);

  const handleAudio = (src: string) => {
    setAudio(src);
  };
  const handleVolume = (vol: number) => {
    setVolume(vol);
  };
  const handlePlay = (ply:boolean) => {
    setPlay(ply);
  };

  return (
    <main className="">
      <AudioManager volume={volume} audio={audio} loop={loop} play={play} />
      {scene === "hero" && (
         <SceneTransition sceneKey="hero">
             <>
          <Navbar />
          <Hero onBegin={() => {
            setScene("reveal")
            handleAudio(MUSIC_STORE.softPiano);
            handlePlay(true);
          }} />
        </>
         </SceneTransition>
      )}

      {scene === "reveal" && (
         <SceneTransition sceneKey="reveal" >
             <BirthdayReveal visible={true} onComplete={() => {
          setScene("garden")
          handleAudio(MUSIC_STORE.pianoSolo);
          }} />
         </SceneTransition>
      )}

      {scene === "garden" && (
        <SceneTransition sceneKey="garden">
          <FlowerGarden onComplete={() => {
            setScene("memories")
            handleAudio(MUSIC_STORE.emotionalPiano);
            }} />
        </SceneTransition>
      )}

      {scene === "memories" && (
        <SceneTransition sceneKey="memmorie">
          <MemoryGallery onComplete={() => setScene("loveletter")} />
        </SceneTransition>
      )}

      {scene === "loveletter" && (
        <SceneTransition sceneKey="loveletter">
            <LoveLetter handleAudio={handleAudio} onComplete={() => {
          setScene("countdown")
          handleAudio(MUSIC_STORE.countDown)
        }} />
        </SceneTransition>
      )}

      {scene === "countdown" && (
         <SceneTransition sceneKey="countdown">
             <SurpriseCountdown onComplete={() => {
          setScene("fireworks")
          handleAudio(MUSIC_STORE.fireworks)
        }} />
         </SceneTransition>
      )}

      {scene === "fireworks" && (
        <SceneTransition sceneKey="fireworks">
          <Fireworks onComplete={() => {
          setScene("final")
          handleAudio(MUSIC_STORE.nonstalgia);
         }} />
        </SceneTransition>
      )}

      {scene === "final" && <SceneTransition sceneKey="final">
              <FinalScene onReplay={() => {
        setScene("hero")
        handlePlay(false);
      }} />
          </SceneTransition>}
    </main>
  );
};

export default App;
