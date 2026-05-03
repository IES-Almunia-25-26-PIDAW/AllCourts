import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styles from './index.module.scss';

export default function ManagerDashboard() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user && user.role !== 'manager') {
      router.replace('/clubs');
    }
  }, [user, router]);

  return (
    <main className={styles.page}>
      <h1>Manager Dashboard</h1>
      <p>Esta sección está en construcción.</p>
    </main>
  );
}
