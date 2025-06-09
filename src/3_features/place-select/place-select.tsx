'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useReviewQuery } from '@/shared/api';
import { getAbbr } from '@/shared/lib/string'
import { Icon } from '@/shared/ui/icon'; 
import { CaretDownFill, CaretUpFill } from '@/shared/ds/icons';

import styles from './place-select.module.scss';
import { Place } from '@/shared/api';

interface PlaceOption extends Place {
  selected: boolean;
}

interface PlaceSelectProps extends React.HTMLAttributes<HTMLDivElement> {
  places: any[]
}

export function PlaceSelect({places}: PlaceSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [reviewQuery, setReviewQuery] = useReviewQuery();
  const selectedPlaceId = reviewQuery.place_id;

  function changePlace(placeId: string) {
    setReviewQuery({
      ...reviewQuery,
      place_id: placeId
    });
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && ref.current.contains(event.target as Node)) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const handleClickOption = (place: Place) => {
    setIsOpen(false);
    changePlace(place.id);
  };

  const selected = places.find((place) => place.id === selectedPlaceId) || places[0];

  return (
    <div className={styles.root}>
      <select style={{ display: 'none' }}>
        {places && places.map((place) => (
          <option
            key={place.id}
            defaultValue={place.id}
            selected={place.id === selectedPlaceId}
          >
            {place.name}
          </option>
        ))}
      </select>
      <div
        ref={ref}
        className={clsx(styles.select, {[styles.selectOpen]: isOpen})}
        aria-hidden
      >
        {selected && <div
          className={styles.selectedContent}
          onClick={toggleOpen}
        >
          <div className={styles.selectedContentIcon}>{getAbbr(selected.name)}</div>
          <div className={styles.selectedLabel}>{selected.name}</div>
          <Icon
            className={styles.caret}
            src={isOpen ? CaretUpFill : CaretDownFill}
            width={12}
            height={12}
          />
        </div>}
        <div
          className={styles.dropdown}
        >
          {places.map((place) => (
            <div
              data-abbr={getAbbr(place.name)}
              key={place.id}
              className={clsx(styles.option, {[styles.optionSelected]: place.id == selectedPlaceId})}
              onClick={handleClickOption.bind(null, place)}
            >
              <div className={styles.optionContent}>
                <div className={styles.optionIcon}>{getAbbr(place.name)}</div>
                <div className={styles.optionLabel}>{place.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}