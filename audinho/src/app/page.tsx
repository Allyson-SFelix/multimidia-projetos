"use client"

import { useRef, useState } from "react";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";

export default function Home() {
  const [playing, isPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const audioUrl = "./audio/videoplayback.mp3";

  const playPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    isPlaying(!playing);
  };

  const configVolume = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = value;
    setVolume(value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xs flex flex-col items-center gap-6">
        
        <audio ref={audioRef} src={audioUrl} hidden />

        <h1 className="text-xl font-bold text-gray-800">Player de Áudio</h1>

        <button 
          onClick={playPause} 
          className="text-6xl text-amber-500 hover:text-amber-600 transition-colors"
        >
          {playing ? <FaPauseCircle /> : <FaPlayCircle />}
        </button>

        <div className="flex flex-col items-center gap-2 w-full">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Volume: {Math.round(volume * 100)}%
          </label>
          <input 
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => configVolume(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg  cursor-pointer "
          />
        </div>

      </div>
    </div>
  );
}