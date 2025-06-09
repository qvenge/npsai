'use client';

import { useState, useRef, useEffect } from 'react';
import { capitalize } from '@/shared/lib/string';
import { BaseReviewQuery, ReviewSummary } from '@/shared/api'
import { ButtonContainer, Icon } from '@/shared/ui';
import { SmileyFill, SmileyMehFill, SmileySadFill, WarningCircleFill, CaretDownFill } from '@/shared/ds/icons';
import clsx from 'clsx';

import styles from './summary.module.scss';
import { RadioMenu } from './radio-menu';

export interface SummaryProps {
  data: ReviewSummary;
}

const npsTypes = {
  nps: 'По умолчанию',
  nps_with_spam: 'C учетом спама',
  nps_by_user_ratings: 'По пользовательской оценке'
};

export function Summary({data}: SummaryProps) {
  const npsMenuRef = useRef<HTMLDivElement>(null);
  const [npsMenuOpen, setNpsMenuOpen] = useState(false);
  const [npsType, setNpsType] = useState<keyof typeof npsTypes>('nps');
  const reviewCount = data.count.all;

  useEffect(() => {
    if (!npsMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (npsMenuRef.current && !npsMenuRef.current.contains(event.target as Node)) {
        setNpsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [npsMenuRef, npsMenuOpen]);

  const items = [
    {
      name: 'positive',
      title: 'Положительные',
      value: data.count.positive,
      icon: SmileyFill
    },
    {
      name: 'neutral',
      title: 'Нейтральные',
      value: data.count.neutral,
      icon: SmileyMehFill
    },
    {
      name: 'negative',
      title: 'Отрицательные',
      value: data.count.negative,
      icon: SmileySadFill
    },
    {
      name: 'spam',
      title: 'Спам',
      value: data.count.spam,
      icon: WarningCircleFill
    }
  ];

  const csat = data.ratings.current_period.csat;
  const nps = data.ratings.current_period[npsType];
  const prevNps = data.ratings.prev_period[npsType];

  const csatDiff = csat - data.ratings.prev_period.csat;
  const npsDiff = nps - prevNps;

  const handleNpsTypeChange = (value: keyof typeof npsTypes) => {
    setNpsType(value);
    setNpsMenuOpen(false);
  }

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.cardMain}>
          <div className={styles.cardTitle}>Отзывы</div>
          <div className={styles.cardValue}>{reviewCount}</div>
        </div>
        <div className={styles.divider} />
        <div className={styles.cardAdditional}>
          {items.map(({ name, title, value, icon }) => (
            <div key={name} className={styles.cardItem}>
              <Icon
                className={clsx(styles.cardItemIcon, styles[`cardItemIcon${capitalize(name)}`])}
                src={icon}
              />
              <div className={styles.cardItemTitle}>{title}</div>
              <div className={styles.cardItemValue}>{value}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardMain}>
          <ButtonContainer onClick={() => setNpsMenuOpen(!npsMenuOpen)}>
            <div className={styles.cardTitle} ref={npsMenuRef}>
              NPS
              <Icon
                className={styles.cardTitleIcon}
                src={CaretDownFill}
                width={12}
                height={12}
              />
              <div style={{display: npsMenuOpen ? 'block' : 'none'}}className={styles.npsDropdown}>
                <RadioMenu
                  items={Object.entries(npsTypes).map(([key, value]) => ({
                    value: key,
                    label: value,
                    checked: key === npsType
                  }))}
                  value={npsType}
                  onChange={(e) => handleNpsTypeChange(e.target.value as keyof typeof npsTypes)}
                />
              </div>
            </div>
          </ButtonContainer>
          <div className={styles.cardValue}>
            {formatStatValue(nps)}
            <span className={clsx(
              styles.cardValueChange,
              styles[`cardValueChange${npsDiff < 0 ? 'Negative' : 'Positive'}`]
            )}>
              {formatStatValue(npsDiff)}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardMain}>
          <div className={styles.cardTitle}>CSAT</div>
          <div className={styles.cardValue}>
          {formatStatValue(csat)}
            <span className={clsx(
              styles.cardValueChange,
              styles[`cardValueChange${csatDiff < 0 ? 'Negative' : 'Positive'}`]
            )}>
              {formatStatValue(csatDiff)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function formatStatValue(value: number): string {
  return `${(value * 100)?.toFixed(0)}%`;
}
