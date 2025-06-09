'use client';

import { useEffect, useCallback, useRef, useState, type MouseEventHandler } from 'react';
import { Portal, createContainer } from '@/shared/ui/portal';
import { ButtonContainer } from '@/shared/ui/button';
import { XBold } from '@/shared/ds/icons';
import { Icon } from '@/shared/ui/icon';

import styles from './modal.module.scss';

const MODAL_CONTAINER_ID = 'modal-container-id';

export interface ModalProps {
  onClose?: () => void;
  children?: React.ReactNode;
}

export function Modal({ onClose, children }: ModalProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    createContainer({ id: MODAL_CONTAINER_ID });
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleWrapperClick = (event: MouseEvent) => {
      const { target } = event;

      if (target instanceof Node && rootRef.current === target) {
        onClose?.();
      }
    };
    const handleEscapePress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('click', handleWrapperClick);
    window.addEventListener('keydown', handleEscapePress);

    return () => {
      window.removeEventListener('click', handleWrapperClick);
      window.removeEventListener('keydown', handleEscapePress);
    };
  }, [onClose]);

  const handleClose: () => void =
  useCallback(() => {
    onClose?.();
  }, [onClose]);

  return (
    isMounted
    ? (<Portal id={MODAL_CONTAINER_ID}>
        <div className={styles.layer} ref={rootRef}>
          <div className={styles.overlay} onClick={() => handleClose()}/>
          <div className={styles.content}>
            <ButtonContainer
              className={styles.closeButton}
              onClick={handleClose}
            >
              <Icon className={styles.closeIcon} src={XBold} width={24} height={24} />
            </ButtonContainer>
            {children}
          </div>
        </div>
    </Portal>)
    : null
  );
}
