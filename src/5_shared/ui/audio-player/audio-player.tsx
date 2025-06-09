'use client';

import React, { useRef, useState, useEffect } from 'react';

import { Icon, ButtonContainer } from '@/shared/ui';
import { PlayCircleFill, PauseCircleFill, SpeakerHighRegular, XRegular } from '@/shared/ds/icons';

import { AudioTimeline } from './ui/timeline/timeline';
import { VolumeController } from './ui/volume-controller/volume-controller';

import { useAudioPlayer } from './audio-player-context';
import styles from './audio-player.module.scss';

export const AudioPlayer = () => {
  const [audioState, dispatchAction] = useAudioPlayer();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(10);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const isPlaying = Boolean(audioState?.isPlaying);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    }
    const updateDuration = () => setDuration(audio.duration);
    const updateVolume = () => setVolume(audio.volume);
    const onEnded = () => dispatchAction({type: 'PAUSE'});

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('volumechange', updateVolume);
    audio.addEventListener('ended', onEnded);

    updateTime();
    updateVolume();
    updateDuration();

    if (isPlaying) {
      audio.play();
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audioState?.src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    dispatchAction({ type: isPlaying ? 'PAUSE' : 'PLAY' });
  };

  const closePlayer = () => {
    dispatchAction({ type: 'SET_SOURCE', payload: { src: null } });
  }

  const changeVolume = (value: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = value;
  };

  const handleTimelineChange = (e: any) => {
    if (!audioRef.current) return;
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  if (!audioState.src) return null;

  return (
    <div className={styles.audioPlayer}>
      <audio ref={audioRef} src={audioState.src} preload="auto" />
      <div className={styles.controls}>
        <ButtonContainer
          className={styles.playButton}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          onClick={togglePlay}
        >
          <Icon
            src={isPlaying ? PauseCircleFill : PlayCircleFill}
            width={44}
            height={44}
          />
        </ButtonContainer>
        <AudioTimeline
          className={styles.timeline}
          currentTime={currentTime}
          duration={duration}
          onChange={handleTimelineChange}
        />
        <div className={styles.actions}>
          <VolumeController value={volume} onChange={changeVolume}/>
          <div className={styles.actionDivider} />
          <ButtonContainer
            className={styles.closeButton}
            aria-label='Close'
            onClick={closePlayer}
          >
            <Icon
              src={XRegular}
              width={24}
              height={24}
            />
          </ButtonContainer>
        </div>
      </div>
    </div>
  );
};
