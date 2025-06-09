'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Place, ReviewSummary, useRemoteData } from '@/shared/api';
import { Icon, Button, TextButton, Modal, ButtonContainer, LinkWithParams } from '@/shared/ui';
import { BedRegular, PencilSimpleBold, ChartBarBold, CaretRightBold } from '@/shared/ds/icons';
import { getAbbr } from '@/shared/lib/string';
import { InfoSkeleton } from './info-skeleton';
import { placeTypeLabels } from '../../const';

import { PlaceForm } from '../place-form';
import styles from './place-card.module.scss';
import { HOST } from '@/shared/api/const';

interface Stats {
  reviewCount: number;
  nps: number;
  csat: number;
}

interface PlaceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Place;
}

/**
 * A card with information about a place, which can be a hotel,
 * cafe, restaurant, etc.
 *
 * @param {PlaceCardProps} props
 *
 * @prop {Place} data - The place data.
 */
export function PlaceCard({data: dataInit}: PlaceCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  // const [stats, setStats] = useState<{reviewCount: number, nps: number, csat: number} | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: stats, isPending } = useRemoteData<ReviewSummary, [Stats]>('summary', {
    query: {place_id: dataInit.id},
    decoders: [(summary) => {
      const reviewCount = summary.count.positive + summary.count.neutral + summary.count.negative;

      return {
        reviewCount,
        nps: reviewCount > 0
          ? Math.round((summary.count.positive - summary.count.negative) / reviewCount * 100)
          : 0,
        csat: reviewCount > 0
          ? Math.round(summary.count.positive / reviewCount * 100)
          : 0
      };
    }]
  });

  const data = useMemo(() => ({
    ...dataInit,
    // typeIcon: BedRegular,
    typeLabel: placeTypeLabels[dataInit.ptype] ?? dataInit.ptype,
  }), [dataInit]);

  const qrUrl = `${HOST}/${data.qr_url}`;

  const handleQrUrlCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Фоллбек (например, через execCommand), если нужно
      setCopied(false);
    }
  };

  function downloadSvg() {
    fetch('/api/proxy-static?url=' + encodeURIComponent(qrUrl))
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.name}.svg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      });
}

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        {data.image_url ? (
          <Image
            src={`${HOST}/${data.image_url}`}
            width={56}
            height={56}
            alt={data.name}
            className={styles.image}
          />) : (
          <div className={styles.imagePlaceholder}>
            {getAbbr(data.name)}
          </div>
        )}
        <div className={styles.info}>
          <div className={styles.infoHeader}>
            <div className={styles.placeType}>
              {/* <Icon className={styles.placeTypeIcon} src={data.typeIcon} /> */}
              <div className={styles.placeTypeText}>{data.typeLabel}</div>
            </div>
            <div className={styles.controls}>
              <Suspense>
                <LinkWithParams href={`/statistics`}>
                  <TextButton
                    className={styles.control}
                    type='primary'
                    size='s'
                  >
                    <Icon
                      className={styles.controlIcon}
                      src={ChartBarBold}
                      width={16}
                      height={16}
                    />
                    <div className={styles.controlText}>Статистика</div>
                  </TextButton>
                </LinkWithParams>
              </Suspense>
              <TextButton
                className={styles.control}
                type='primary'
                size='s'
                onClick={() => setIsEditModalOpen(true)}
              >
                <Icon
                  className={styles.controlIcon}
                  src={PencilSimpleBold}
                  width={16}
                  height={16}
                />
                <div className={styles.controlText}>Изменить</div>
              </TextButton>
            </div>
          </div>
          <div className={styles.placeName}>{data.name}</div>
        </div>
      </div>
      <div className={styles.body}>
        {isPending || !stats ? <InfoSkeleton /> : (
          <div className={styles.stats}>
            <Suspense>
              <LinkWithParams href={`/reviews`}>
                <div className={styles.stat}>
                  <div className={styles.statHeader}>
                    <div className={styles.statLabel}>Отзывы</div>
                    <Icon
                      className={styles.statIcon}
                      src={CaretRightBold}
                      width={16}
                      height={16}
                    />
                  </div>
                  <div className={styles.statValue}>{stats.reviewCount}</div>
                </div>
              </LinkWithParams>
            </Suspense>
            <div className={styles.stat}>
              <div className={styles.statHeader}>
                <div className={styles.statLabel}>CSAT</div>
              </div>
              <div className={styles.statValue}>{`${stats.csat}%`}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statHeader}>
                <div className={styles.statLabel}>NPS</div>
              </div>
              <div className={styles.statValue}>{`${stats.nps}%`}</div>
            </div>
          </div>
        )}
        <ButtonContainer
          className={styles.qrOpenButton}
          onClick={() => setIsQrModalOpen(true)}
        >
          <Image
            src={qrUrl}
            alt="QR код заведения"
            width={48}
            height={48}
            className={styles.qr}
          />
        </ButtonContainer>
      </div>
      {isQrModalOpen &&
        <Modal onClose={() => setIsQrModalOpen(false)}>
          <div className={styles.qrModal}>
            <div className={styles.qrModalImageInfo}>
              <Image
                src={qrUrl}
                alt="QR код заведения"
                width={120}
                height={120}
                className={styles.qr}
              />
              <div className={styles.qrModalInfo}>
                <div className={styles.qrModalName}>{data.name}</div>
                <div className={styles.qrModalTitle}>QR-code</div>
              </div>
            </div>
            <div className={styles.qrModalControls}>
              <Button
                style={{ alignSelf: 'stretch' }}
                type="primary"
                size="l"
                onClick={downloadSvg}
              >
                Скачать в SVG
              </Button>
              <TextButton
                type="primary"
                size="m"
                onClick={handleQrUrlCopy}
                disabled={copied}
              >
                {copied ? 'Скопировано' : 'Скопировать ссылку'}
              </TextButton>
            </div>
          </div>
        </Modal>
      }
      {isEditModalOpen &&
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <PlaceForm data={data} />
        </Modal>
      }
    </div>
  );
}
