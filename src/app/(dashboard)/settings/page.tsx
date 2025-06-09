import { signOut, auth } from '@/auth';
import { getUser } from '@/shared/api';
import { Button } from '@/shared/ui';
import styles from './page.module.scss';

import { LogoutButton } from './ui/logout-button';


export default async function Settings() {
  const session = await auth();

  if (session?.access_token == null) {
    return;
  }

  const me = await getUser(session.access_token);

  return (
    <div className={styles.root}>
      {/* Тариф */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardDesc}>Текущий тариф</div>
          <div className={styles.cardTitle}>Бесплатный</div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardInfo}>
            <div className={styles.cardInfoLabel}>Тариф оплачен до</div>
            <div className={styles.cardInfoValue}>--.--.---</div>
          </div>
          <div className={styles.cardInfo}>
            <div className={styles.cardInfoLabel}>Осталось отзывов</div>
            <div className={styles.cardInfoValue}>
              <span className={styles.cardInfoValueSpent}>--</span>
              <span className={styles.cardInfoValueTotal}> / --</span>
            </div>
          </div>
        </div>
        <div className={styles.cardFooter}>

        </div>
      </div>

      {/* О компании */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>{me.info.name ?? me.email}</div>
          <div className={styles.cardDesc}>{me.info.addres}</div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardInfo}>
            <div className={styles.cardInfoLabel}>ИНН</div>
            <div className={styles.cardInfoValue}>{me.info.INN}</div>
          </div>
          <div className={styles.cardInfo}>
            <div className={styles.cardInfoLabel}>КПП</div>
            <div className={styles.cardInfoValue}>{me.info.KPP}</div>
          </div>
          <div className={styles.cardInfo}>
            <div className={styles.cardInfoLabel}>ОГРН</div>
            <div className={styles.cardInfoValue}>{me.info.OGRN}</div>
          </div>
        </div>
        <div className={styles.cardFooter}>
          <LogoutButton
            className={styles.cardFooterBtn}
          >
            Выйти
          </LogoutButton>
        </div>
      </div>
    </div>
  );
}
