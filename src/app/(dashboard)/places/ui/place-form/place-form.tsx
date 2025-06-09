'use client';

import Image from 'next/image';
import Form from 'next/form';
import { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  Button,
  TextButton,
  ButtonContainer,
  TextInput,
  Select,
  Icon,
  UploadImageInput,
  Toggle,
  Modal
} from '@/shared/ui'; 

import { CameraRegular } from '@/shared/ds/icons';
import { placeTypeLabels } from '../../const';

import { addPlaceAction, editPlaceAction, deletePlaceAction } from './action';
import styles from './place-form.module.scss';
import { Place, API_HOST } from '@/shared/api';
import { getAbbr} from '@/shared/lib/string';

export interface PlaceFormProps {
  data?: Place;
  confirmDelete?: (id: number | string) => Promise<boolean>;
}

export function PlaceForm({data, confirmDelete}: PlaceFormProps) {
  const [state, action, pending] = useActionState(data ? editPlaceAction.bind(null, data.id) : addPlaceAction, undefined);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  useEffect(() => {
    if (pending || !state?.success) {
      return;
    }

    location.reload();
  }, [state, pending]);

  const handleDeleteClick = async () => {
    if (!data || (confirmDelete && !confirmDelete(data.id))) {
      return;
    }

    const res = await deletePlaceAction(data.id);
    location.reload();
  };

  return (
    <form action={action} className={styles.root}>
      <UploadImageInput
        name="pic_file"
        disabled={pending}
        previewInit={data?.image_url ? {
          src: `/api/http-proxy?url=${API_HOST}/${data.image_url}`,
          alt: data.name
        } : undefined}
      />
      <div className={styles.inputs}>
        <TextInput
          name="name"
          type="text"
          label="Название"
          disabled={pending}
          defaultValue={data?.name}
          required
          placeholder="Введите название"
          error={Boolean(state?.errors?.name)}
          hint={state?.errors?.name && state.errors.name[0]}
        />
        <Select
          name="ptype"
          label="Тип заведения"
          placeholder="Не выбрано"
          defaultValue={data?.ptype}
          required
          disabled={pending}
          errorMessage={state?.errors?.ptype && state.errors.ptype[0]}
          options={
            Object.entries(placeTypeLabels).map(([value, label]) => ({ label, value }))
            // [
            //   { label: 'Кафе', value: 'cafe' },
            //   { label: 'Ресторан', value: 'restaurant' },
            //   { label: 'Бар', value: 'bar' },
            //   { label: 'Клуб', value: 'club' },
            //   { label: 'Отель', value: 'hotel' },
            //   { label: 'Спа', value: 'spa' }
            // ]
          }
        />
        <TextInput
          name="notification_recipient"
          type="text"
          label="Телеграм"
          defaultValue={data?.notification_recipient}
          required
          placeholder="Введите телеграм"
          disabled={pending}
          error={Boolean(state?.errors?.notification_recipient)}
          hint={state?.errors?.notification_recipient && state.errors.notification_recipient[0]}
        />
        <Toggle
          defaultChecked={Boolean(data?.notification_enable)}
          name="notification_enable"
          label="Отправлять уведомления"
          disabled={pending}
        />
      </div>
      <div className={styles.buttons}>
        <Button
          className={styles.button}
          htmlType='submit'
          type="primary"
          size="l"
          disabled={pending}
        >
          {data ? 'Сохранить изменения' : 'Добавить'}
        </Button>
        {data && (
          <TextButton
            className={styles.button}
            type="negative"
            size="m"
            disabled={pending}
            style={{ alignSelf: 'center' }}
            onClick={() => setIsDeleteModal(true)}
          >
            Удалить заведение
          </TextButton>
        )}
      </div>
      {data && isDeleteModal && (
        <Modal onClose={() => setIsDeleteModal(false)}>
          <div className={styles.deleteModal}>
            <div className={styles.deleteModalInfo}>
              <div className={styles.deleteModalTitle}>Удалить заведение</div>
              <div className={styles.deleteModalText}>Вы действительно хотите удалить заведение??</div>
            </div>
            <div className={styles.deleteModalButtons}>
              <Button type="tertiary" size="l" onClick={() => setIsDeleteModal(false)}>Отмена</Button>
              <Button
                type="negative"
                size="l"
                onClick={handleDeleteClick}
              >
                Удалить
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </form>
  );
}