'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Icon } from '@/shared/ui/icon'; 
import { CaretDownFill, CaretUpFill } from '@/shared/ds/icons';

import styles from './select.module.scss';
import { flushSync } from 'react-dom';

interface Option {
  label: React.ReactNode;
  value: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: Option[];
  label?: string;
  value?: string;
  minWidth?: string;
  placeholder?: React.ReactNode;
  align?: 'left' | 'right';
  onChange?: (value: string) => void;
  errorMessage?: string;
}

export function Select({
  options,
  placeholder,
  onChange,
  className,
  style,
  label,
  minWidth,
  align,
  value: inputValue,
  errorMessage,
  ...selectProps
}: SelectProps) {
  const [defaultValue, setDefaultValue] = useState(selectProps.defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  const value = inputValue ?? defaultValue;

  useEffect(() => {
    if (!selectRef.current) {
      return;
    }

    const onFocus = () => setIsFocused(true);
    const onBlur = () => setIsFocused(false);

    selectRef.current.addEventListener('focus', onFocus);
    selectRef.current.addEventListener('blur', onBlur);

    return () => {
      selectRef.current?.removeEventListener('focus', onFocus);
      selectRef.current?.removeEventListener('blur', onBlur);
    };
  }, [selectRef.current])

  const toggleOpen = () => {
    selectRef.current?.focus();
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

      selectRef.current?.blur();
      setIsOpen(false);
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const handleClickOption = (newValue: string) => {
    if (inputValue == null) {
      setDefaultValue(newValue);
    }

    onChange?.(newValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={clsx(
      className,
      styles.root,
      {
        [styles.disabled]: selectProps.disabled,
        [styles.error]: errorMessage,
        [styles.open]: isOpen,
        [styles.focused]: isFocused,
        [styles.notSelected]: selectedOption == null
      }
    )}>
      <label className={styles.wrapper}>
        {label && <div className={styles.label}>{label}</div>}
        <div
          ref={ref}
          className={styles.select}
          style={style}
        >
          <select
            className={styles.selectItself}
            ref={selectRef}
            value={value}
            onChange={() => {}}
            {...selectProps}
          >
            <option value=""></option>
            {options.map((opt, i) => (
              <option
                key={i}
                defaultValue={opt.value}
                selected={opt.value === value}
              >
                {opt.value}
              </option>
            ))}
          </select>
          <div
            className={styles.selectedContentWrapper}
            style={{ minWidth }}
            onClick={toggleOpen}
          >
            <div className={styles.selectedContent}>
              {selectedOption ? selectedOption.label : placeholder}
            </div>
            <Icon
              className={styles.caret}
              src={isOpen ? CaretUpFill : CaretDownFill}
              width={12}
              height={12}
            />
          </div>
          <div
            className={styles.dropdown}
            style={{ [align ?? 'left']: 0 }}
          >
            {options.map((opt, i) => (
              <div
                key={i}
                className={clsx(styles.option, {[styles.optionSelected]: opt.value == value})}
                onClick={() => handleClickOption(opt.value)}
              >
                <div className={styles.optionContent}>
                  {opt.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </label>
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
}