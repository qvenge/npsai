import React, { useRef, useState, useEffect } from "react";
import styles from './timeline.module.scss';
import { Slider } from '@/shared/ui';

export interface AudioPlayerProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export function AudioTimeline({ currentTime, duration, onChange }: any) {
  const formatTime = (sec: number): string => {
    if (!sec) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.timeline}>
      <span className={styles.time}>
        {`${formatTime(currentTime)} / ${formatTime(duration)}`}
      </span>
      <Slider
        className={styles.slider}
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={onChange}
        step={0.01}
      />
    </div>
  );
};