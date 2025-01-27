import { useRef } from 'react';

export const useSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = async () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
      await audioRef.current.play();
    }
  };

  return { audioRef, playAudio };
};
