'use client';

import { useReviewQuery } from '@/shared/api';
import { getAbbr } from '@/shared/lib/string'
import { Select } from '@/shared/ui';

import styles from './place-select.module.scss';
import { Place } from '@/shared/api';

interface PlaceItemProps {
  data: Place;
  selected?: boolean;
  handleClickOption?: (place: Place) => void;
}

interface PlaceSelectProps extends React.HTMLAttributes<HTMLDivElement> {
  places: any[]
}

export function PlaceSelect({places}: PlaceSelectProps) {
  const [reviewQuery, setReviewQuery] = useReviewQuery();
  const selectedPlaceId = reviewQuery.place_id ?? places[0].id;

  const handleChangePlace = (placeId: string) => {
      setReviewQuery({
      ...reviewQuery,
      place_id: placeId
    });
  };

  return (
    <Select
      className={styles.root}
      style={{width: '240px', position: 'relative', zIndex: 500}}
      options={places.map((place) => ({
        label: <PlaceItem data={place} />,
        value: place.id
      }))}
      value={selectedPlaceId}
      onChange={handleChangePlace}
    />
  );
}

function PlaceItem({data}: PlaceItemProps) {
  return (
    <div className={styles.optionContent}>
      <div className={styles.optionIcon}>{getAbbr(data.name)}</div>
      <div className={styles.optionLabel}>{data.name}</div>
    </div>
  )
}