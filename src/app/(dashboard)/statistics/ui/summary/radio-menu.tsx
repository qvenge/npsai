'use client';

import clsx from 'clsx';
import { useState } from 'react';

import styles from './radio-menu.module.scss';

type ParentProps = React.InputHTMLAttributes<HTMLInputElement>;

interface RadioMenuProps extends Omit<ParentProps, 'type'> {
  items: {label: string, value: string}[];
}

export function RadioMenu({
  items,
  value,
  className,
  style,
  ...inputProps
}: RadioMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <fieldset className={clsx(className, styles.root)} style={style}>
      {items.map((item) => (
        <div
          className={styles.item}
          key={item.value}
        >
          <input
            name="radio"
            className={styles.inputItself}
            id={`radio-${item.value}`}
            value={item.value}
            defaultChecked={item.value === value}
            // checked={item.value === value}
            type="radio"
            {...inputProps}
          />
          <label
            className={styles.label}
            htmlFor={`radio-${item.value}`}
            key={item.value}
          >
            {item.label}
          </label>
        </div>
      ))}
    </fieldset>
  )
}