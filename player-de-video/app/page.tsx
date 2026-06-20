"use client"

import { useEffect, useRef, useState } from "react";
import { FaBackward, FaForward, FaPauseCircle, FaPlayCircle, FaStepBackward, FaStepForward } from "react-icons/fa";
import videos from "./data/videos"; 

export default function Home() {
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoIndex, setVideoIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [velocity, setVelocity] = useState<number>(1);
  const [colorFilter, setColorFilter] = useState<string>("normal");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration || 0);
    const handleEnded = () => setVideoIndex((prev) => prev + 1);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);

    if (video.readyState >= 1) {
      setDuration(video.duration);
    }

    if (playing) {
      video.play().catch(() => setPlaying(false));
    }

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
    }
  }, [videoIndex, playing]);

  const formatTime = (time: number) => {
    const minutes = Math.trunc(time / 60);
    const seconds = Math.trunc(time % 60);
    return ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
  }

  const playPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
    } else {
      video.play();
    }
    setPlaying(!playing);
  }

  const configVolume = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = value;
    setVolume(value);
  }

  const configVideo = (index: number) => {
    if (!videos) return;
    if (index >= videos.length) {
      index = 0; 
    } else if (index < 0) {
      index = videos.length - 1;
    }
    setVideoIndex(index);
  }

  const configVelocity = (number: number) => {
    let newVelocity = number;
    if (newVelocity > 3) {
      newVelocity = 1;
    }
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = newVelocity;
    setVelocity(newVelocity);
  }

  const configCurrentTime = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
  }

  const renderColorOverlay = () => {
    switch (colorFilter) {
      case "red":
        return <div className="absolute inset-0 bg-red-500 mix-blend-color pointer-events-none opacity-80 transition-colors"></div>;
      case "blue":
        return <div className="absolute inset-0 bg-blue-600 mix-blend-color pointer-events-none opacity-80 transition-colors"></div>;
      case "green":
        return <div className="absolute inset-0 bg-green-500 mix-blend-color pointer-events-none opacity-80 transition-colors"></div>;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col bg-amber-400 max-w-4xl mx-auto p-6 gap-6 rounded-2xl mt-10 shadow-2xl text-gray-900">
      
      <div className="flex flex-col w-full items-center bg-black/5 p-6 rounded-xl shadow-inner">
        
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-6 shadow-xl ring-4 ring-black/10">
          <video 
            ref={videoRef} 
            src={videos?.[videoIndex]?.url} 
            className={`w-full h-full object-contain transition-all ${colorFilter === 'grayscale' ? 'grayscale' : ''}`}
            onClick={playPause}
          ></video>
          {renderColorOverlay()}
        </div>

        <h2 className="text-3xl font-extrabold mb-6 text-center">{videos?.[videoIndex]?.nome}</h2>

        <div className="flex items-center gap-8 mb-6 text-3xl">
          <button onClick={() => configVideo(videoIndex - 1)} className="hover:scale-110 hover:text-white transition-all">
            <FaStepBackward />
          </button>
          
          <button onClick={() => configCurrentTime(currentTime - 10)} className="hover:scale-110 hover:text-white transition-all text-2xl">
            <FaBackward />
          </button>

          <button onClick={playPause} className="text-5xl hover:scale-110 hover:text-white transition-all drop-shadow-md">
            {playing ? <FaPauseCircle /> : <FaPlayCircle />}
          </button>

          <button onClick={() => configCurrentTime(currentTime + 10)} className="hover:scale-110 hover:text-white transition-all text-2xl">
             <FaForward />
          </button>

          <button onClick={() => configVideo(videoIndex + 1)} className="hover:scale-110 hover:text-white transition-all">
            <FaStepForward />
          </button>
        </div>

        <div className="flex items-center w-full gap-4 mb-6 px-4">
          <p className="font-mono font-medium text-sm">{formatTime(currentTime)}</p>
          <input 
            type="range"
            min={0}
            step={0.001}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => configCurrentTime(Number(e.target.value))}
            className="flex-1 cursor-pointer accent-gray-900 h-2 bg-black/20 rounded-lg appearance-none"
          />
          <p className="font-mono font-medium text-sm">{formatTime(duration)}</p>
        </div>

        <div className="flex items-center justify-between w-full mb-8 px-4 bg-white/20 p-3 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="font-bold">Volume:</span>
            <input type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => configVolume(Number(e.target.value))}
              className="cursor-pointer accent-gray-900 w-24"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <span className="font-bold">Velocidade:</span>
            <button 
              onClick={() => configVelocity(velocity + 0.5)} 
              className="bg-gray-900 text-amber-400 px-4 py-1 rounded-full font-bold hover:bg-gray-800 transition-colors shadow-md w-16 text-center"
            >
              {velocity}x
            </button>
          </div>
        </div>

        <hr className="w-full border-black/10 my-2" />

        <div className="w-full mt-4">
          <h3 className="text-center font-bold mb-4 uppercase tracking-wider text-sm text-gray-700">Filtros de Cor</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={() => setColorFilter('normal')} 
              className={`px-5 py-2 rounded-lg font-bold transition-all shadow-sm ${colorFilter === 'normal' ? 'bg-gray-900 text-amber-400 scale-105' : 'bg-white/50 hover:bg-white/80'}`}
            >
              Original
            </button>
            <button 
              onClick={() => setColorFilter('grayscale')} 
              className={`px-5 py-2 rounded-lg font-bold transition-all shadow-sm ${colorFilter === 'grayscale' ? 'bg-gray-600 text-white scale-105' : 'bg-white/50 hover:bg-gray-200'}`}
            >
              Sem Cores
            </button>
            <button 
              onClick={() => setColorFilter('red')} 
              className={`px-5 py-2 rounded-lg font-bold transition-all shadow-sm ${colorFilter === 'red' ? 'bg-red-600 text-white scale-105' : 'bg-white/50 hover:bg-red-200'}`}
            >
              Vermelho
            </button>
            <button 
              onClick={() => setColorFilter('blue')} 
              className={`px-5 py-2 rounded-lg font-bold transition-all shadow-sm ${colorFilter === 'blue' ? 'bg-blue-600 text-white scale-105' : 'bg-white/50 hover:bg-blue-200'}`}
            >
              Azul
            </button>
            <button 
              onClick={() => setColorFilter('green')} 
              className={`px-5 py-2 rounded-lg font-bold transition-all shadow-sm ${colorFilter === 'green' ? 'bg-green-600 text-white scale-105' : 'bg-white/50 hover:bg-green-200'}`}
            >
              Verde
            </button>
          </div>
        </div>
      </div>

      <div className="w-full bg-white/30 p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-extrabold mb-4 flex items-center gap-2">
          Playlist
          <span className="text-sm font-normal bg-gray-900 text-amber-400 px-2 py-1 rounded-full">{videos?.length || 0} vídeos</span>
        </h2>
        
        <ul className="flex overflow-x-auto gap-4 pb-4 snap-x custom-scrollbar">
          {videos?.map((video, index) => {
            return (
              <li 
                key={index} 
                onClick={() => configVideo(index)} 
                className={`flex-none w-56 cursor-pointer p-3 rounded-xl transition-all duration-300 snap-start border-2 ${videoIndex === index ? 'bg-white/80 border-gray-900 shadow-md scale-[1.02]' : 'bg-white/40 border-transparent hover:bg-white/60 hover:scale-[1.02]'}`}
              >
                <div className="w-full aspect-video bg-black/10 rounded-lg overflow-hidden mb-3">
                  <img src={video.imagem} alt={"Capa do vídeo " + video.nome} className="w-full h-full object-cover" />
                </div>
                <h1 className={`text-center font-medium truncate px-1 ${videoIndex === index ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>
                  {video.nome}
                </h1>
              </li>
            )
          })}
        </ul>
      </div>

    </div>
  );
}