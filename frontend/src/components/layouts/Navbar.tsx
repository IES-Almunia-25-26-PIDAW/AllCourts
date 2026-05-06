import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Navbar.module.scss';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isLogged = useSelector(selectIsAuthenticated);
  const user = useSelector((state: any) => state.auth.user);
  const [langLabel, setLangLabel] = useState<string | null>(null);

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('en') ? 'es' : 'en';
    i18n.changeLanguage(newLang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('i18nextLng', newLang);
      } catch {}
      document.cookie = `i18nextLng=${newLang};path=/`;
    }
  };

  useEffect(() => {
    setLangLabel(i18n.language.startsWith('en') ? 'ES' : 'EN');
  }, [i18n.language]);

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/">
          <div className={styles.logo}>
            <Image src="/logoallcourts.png" alt="AllCourts Logo" width={40} height={40} />
            <h1>AllCourts</h1>
          </div>
        </Link>

        <nav className={styles.nav}>
          <>
            <button className={styles.navButton} onClick={toggleLanguage}>
              {langLabel ?? ''}
            </button>

            {isLogged ? (
              <>
                <Link href="/clubs">
                  <button className={styles.navButton}>Clubs</button>
                </Link>
                <Link href="/courts">
                  <button className={styles.navButton}>Reservar</button>
                </Link>
                {user?.role === 'manager' ? (
                  <Link href="/manager">
                    <button className={styles.navButton}>Manager</button>
                  </Link>
                ) : null}
                <Link href="/profile">
                  <a className={styles.profileLink}>
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt="avatar" className={styles.avatar} />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {(user?.name || user?.username || 'U').slice(0, 1)}
                      </div>
                    )}
                  </a>
                </Link>
              </>
            ) : (
              <>
                <Link href="/info/player">
                  <button className={styles.navButton}>{t('header.btn_forplayers')}</button>
                </Link>
                <Link href="/info/manager">
                  <button className={styles.navButton}>{t('header.btn_forclubs')}</button>
                </Link>
                <Link href="/login">
                  <button className={styles.profileButton}>{t('header.btn_profile')}</button>
                </Link>
              </>
            )}
          </>
        </nav>
      </div>
    </header>
  );
}
