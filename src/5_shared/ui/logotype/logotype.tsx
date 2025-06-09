import Image from 'next/image';
import clsx from 'clsx';

import styles from './logotype.module.scss';
import logo from './logotype.svg';

export function Logotype({className}: {className?: string}) {
  return (
    <Image
      className={clsx(className, styles.logo)}
      src={logo}
      alt="NPSai Logotype"
      priority
    />
  );
}
