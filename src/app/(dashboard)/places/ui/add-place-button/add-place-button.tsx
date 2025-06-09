'use client';

import { useState } from 'react';

import { Button, Modal, Icon } from '@/shared/ui'; 
import { PlusBold } from '@/shared/ds/icons';
import { PlaceForm } from '../place-form';

export function AddPlaceButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
        <Button
          type='primary'
          size='l'
          onClick={() => setIsModalOpen(true)}
        >
          <Icon
            src={PlusBold}
            width={20}
            height={20}
          />
          <span>Добавить</span>
        </Button>
        {isModalOpen &&
          <Modal onClose={() => setIsModalOpen(false)}>
            <PlaceForm />
          </Modal>
        }
    </>
  )
}