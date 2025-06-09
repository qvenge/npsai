'use client';

import Link from 'next/link';
import clsx from 'clsx';

import { Logotype } from '@/shared/ui/logotype';
import { Icon, LinkWithParams, LinkWithParamsProps } from '@/shared/ui';
import { usePageContext, Page } from '@/shared/lib'

import styles from './navigation-bar.module.scss';
import { Suspense } from 'react';

interface NavItem extends Page {
  iconDefault: any;
  iconActive: any;
  path: string;
  saveParams?: boolean;
}

export interface NavigationBarProps {
  items: NavItem[];
  readonly className?: string;
}

export function NavigationBar({items, className}: NavigationBarProps) {
  const page = usePageContext();

  return (
    <aside className={clsx(className, styles.root)}>
      <div className={styles.logo}>
        <Logotype />
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {items.map((item) => (
            <li
              key={item.id}
              className={clsx(styles.navItem, { [styles.navItemActive]: page.id === item.id })}
            >
              <Suspense>
                <LinkWithParams
                  className={styles.navItemContent}
                  href={item.path}
                >
                  <Icon
                    src={page.id === item.id ? item.iconActive : item.iconDefault}
                    className={styles.navItemIcon}
                  />
                  <div className={styles.navItemIconTitle}>{item.title}</div>
                </LinkWithParams>
              </Suspense>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}