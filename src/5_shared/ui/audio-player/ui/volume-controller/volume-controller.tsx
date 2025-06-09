'use client';

import React, { useRef, useState, useEffect } from 'react';
import clsx from 'clsx';

import { Icon, ButtonContainer, Slider } from '@/shared/ui';
import { SpeakerHighRegular, SpeakerXRegular } from '@/shared/ds/icons';

import styles from './volume-controller.module.scss';

export interface VolumeControllerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
}

export function VolumeController({
  value,
  onChange,
  className,
  // ...props
}: VolumeControllerProps) {
  const [isShown, setIsShown] = useState(false);

  return (
    <div className={clsx(className, styles.root)}>
      {isShown && (
        <div className={styles.sliderWrapper}>
          <div className={styles.slider}>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={value}
              onChange={(e: any) => onChange(e.target.value)}
            />
          </div>
        </div>
      )}
      <ButtonContainer
        className={styles.button}
        aria-label='Volume'
        onClick={() => setIsShown(!isShown)}
      >
        <Icon
          src={value > 0 ? SpeakerHighRegular : SpeakerXRegular}
          width={24}
          height={24}
        />
      </ButtonContainer>
    </div>
  );
}