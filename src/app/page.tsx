import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import styles from './page.module.css';

export default async function Home() {
  const session = await auth();
  redirect(session ? '/statisctics' : '/login');
  return (
    <div className={styles.page}></div>
  );
}
