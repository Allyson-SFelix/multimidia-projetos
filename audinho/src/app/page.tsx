"use client"

import { useEffect, useRef, useState } from "react";
import { 
  FaPauseCircle, 
  FaPlayCircle, 
  FaBackward, 
  FaForward, 
  FaStepBackward, 
  FaStepForward 
} from "react-icons/fa";


export default function Home() {
  const [playing, isPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [audioIndex, setAudioIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [velocity, setVelocity] = useState<number>(1);

  const audioRef = useRef<HTMLAudioElement>(null);

  const audios = [
      {
        nome: "M1",
        url: "/audio/m1.mp3"
      },
      {
        nome: "M2",
        url: "/audio/m2.mp3"
      },
      {
        nome: "M3",
        url: "/audio/m3.mp3"
      },
    ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.onended = () => {
      configAudio(audioIndex + 1);
    };

    if (playing) {
      audio.play();
    }
  }, [audioIndex, playing]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.trunc(time / 60);
    const seconds = Math.trunc(time % 60);
    return ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
  };

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

  const configAudio = (index: number) => {
    let newIndex = index;
    if (index >= audios.length) {
      newIndex = 0; 
    } else if (index < 0) {
      newIndex = audios.length - 1;
    }
    setAudioIndex(newIndex);
  };

  const configCurrentTime = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const validTime = Math.max(0, Math.min(time, duration));
    audio.currentTime = validTime;
    setCurrentTime(validTime);
  };

  const configVelocity = () => {
    let newVelocity = velocity + 0.5;
    if (newVelocity > 3) {
      newVelocity = 1; 
    }
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = newVelocity;
    setVelocity(newVelocity);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-100 p-4 gap-6">
      
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xs flex flex-col items-center gap-6">
        
        <audio ref={audioRef} src={audios[audioIndex].url} hidden />

        <h1 className="text-xl font-bold text-gray-800 text-center truncate w-full">
          {audios[audioIndex]?.nome }
        </h1>

        <div className="flex items-center justify-center gap-3 w-full">
          <button onClick={() => configAudio(audioIndex - 1)} className="text-gray-400 hover:text-amber-500 transition-colors">
            <FaStepBackward size={18} />
          </button>
          
          <button onClick={() => configCurrentTime(currentTime - 10)} className="text-gray-400 hover:text-amber-500 transition-colors">
            <FaBackward size={18} />
          </button>

          <button 
            onClick={playPause} 
            className="text-6xl text-amber-500 hover:text-amber-600 transition-colors mx-1"
          >
            {playing ? <FaPauseCircle /> : <FaPlayCircle />}
          </button>

          <button onClick={() => configCurrentTime(currentTime + 10)} className="text-gray-400 hover:text-amber-500 transition-colors">
            <FaForward size={18} />
          </button>

          <button onClick={() => configAudio(audioIndex + 1)} className="text-gray-400 hover:text-amber-500 transition-colors">
            <FaStepForward size={18} />
          </button>
        </div>

        <div className="flex flex-col w-full gap-1">
          <input 
            type="range"
            min={0}
            step={0.001}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => configCurrentTime(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between w-full text-xs font-semibold text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 w-full">
          <div className="flex justify-between w-full items-center">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Volume: {Math.round(volume * 100)}%
            </label>
            <button 
              onClick={configVelocity}
              className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded hover:bg-amber-200 transition-colors uppercase"
            >
              Vel: {velocity}x
            </button>
          </div>
          <input 
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => configVolume(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-amber-500"
          />
        </div>

      </div>

      <div className="bg-white p-4 rounded-2xl shadow-xl w-full max-w-xs max-h-48 overflow-y-auto">
        <ul className="flex flex-col gap-2">
          {audios.map((music, index) => (
            <li 
              key={index} 
              onClick={() => configAudio(index)} 
            >
              <span className="text-sm truncate">{music.nome}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}