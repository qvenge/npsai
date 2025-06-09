'use client';

import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { Icon, ButtonContainer } from '@/shared/ui';
import { CameraRegular } from '@/shared/ds/icons';

import styles from './upload-image-input.module.scss';

type InptyProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'accept' | 'ref'>

export interface UploadImageInputProps extends InptyProps {
}

export function UploadImageInput({
  className,
  ...inputProps
}: UploadImageInputProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && ref.current.contains(event.target as Node)) {
        return;
      }

      setIsMenuOpen(false);
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file); // Превращает файл в base64 для предпросмотра
    }
  };

  const handlePreviewClick = () => {
    if (preview != null) {
      setIsMenuOpen(!isMenuOpen);
    } else {
      handleEditClick();
    }
  }

  const handleEditClick = () => {
    setIsMenuOpen(false);
    fileInputRef.current?.click();
  }
  const handleRemoveClick = () => {
    setIsMenuOpen(false);
    setPreview(null);

    if (fileInputRef.current) {
      // @ts-ignore - удобный способ очистить инпут
      fileInputRef.current.value = ''; 
    }
  }

  return (
    <div ref={ref} className={clsx(
      className,
      styles.root,
      inputProps.disabled && styles.disabled
    )}>
      <input
        {...inputProps}
        className={styles.input}
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <ButtonContainer
        className={styles.previewWrapper}
        onClick={handlePreviewClick}
      >
        <div className={styles.preview}>
          {preview ? (
              <img
                className={styles.previewImg}
                src={preview}
                alt="preview"
              />  
            ) : (
              <Icon
                // className={styles.previewImg}
                src={CameraRegular}
                width={36}
                height={36}
              />
            )
          }
        </div>
      </ButtonContainer>
      {isMenuOpen && <div className={styles.menu}>
        <ButtonContainer
          onClick={handleEditClick}
        >
          <div className={styles.menuButton}>
            Заменить
          </div>
        </ButtonContainer>
        <ButtonContainer
          onClick={handleRemoveClick}
        >
          <div className={clsx(styles.menuButton, styles.menuButtonRed)}>
            Удалить
          </div>
        </ButtonContainer>
      </div>}

    </div>
  );
}