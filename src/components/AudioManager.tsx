import { useEffect, useRef } from "react";

const AudioManager = ({audio, play = false, loop = false, volume}: {audio: string, play: boolean, loop: boolean, volume: number}) => {
   const audioRef = useRef<HTMLAudioElement | null>(null);
   useEffect(() => {
      const audioElement = audioRef.current;
      if(!audioElement) return;
        audioElement.src = audio;
        audioElement.loop = loop;
        audioElement.volume = volume;
       if(play) {
          audioElement.play().catch(()=> {});
       }
       else {
        audioElement.pause();
       }
       return () => {
           audioElement.pause();
       }
   }, [audio, play, loop, volume])


  return <audio ref = {audioRef}
      preload="auto" />
}



export default AudioManager;