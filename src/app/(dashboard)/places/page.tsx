import { getPlaces, BaseReviewQuery } from '@/shared/api';

import { PlaceCard } from './ui/place-card';

import styles from './places.module.scss';

export default async function Places({searchParams}: {
  searchParams?: Promise<BaseReviewQuery>
}) {
  const places = await getPlaces();

  return (
    <div className={styles.page}>
      {places.map((place) => (
        <PlaceCard key={place.id} data={place} />
      ))}
    </div>
  );
}