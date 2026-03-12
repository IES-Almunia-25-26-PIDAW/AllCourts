import { useTranslation } from 'react-i18next';
import styles from './Cookies.module.scss';

export default function CookiesPolicy() {
  const { t } = useTranslation();

  return (
    <div className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1>{t('cookies.title')}</h1>
          <p>{t('cookies.initial_text')}</p>
          <div className={styles.heroMeta}>
            <span>{t('cookies.update_date')}</span>
            <span>LSSI-CE · RGPD</span>
          </div>
        </div>
      </section>

      <div className={styles.pageWrap}>
        <section className={styles.section}>
          <h2>{t('cookies.intro_title')}</h2>
          <p>{t('cookies.intro_text')}</p>
          <p>{t('cookies.intro_text2')}</p>
          <div className={styles.highlightBox}>
            <p>{t('cookies.consent_text')}</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>{t('cookies.type_title')}</h2>
          <h3>{t('cookies.type_subtitle1')}</h3>
          <div className={styles.cookieTypes}>
            <div className={styles.cookieCard}>
              <div className={styles.icon}>⚡</div>
              <h3>{t('cookies.duration_subtitle1')}</h3>
              <p>{t('cookies.duration_text1')}</p>
            </div>
            <div className={styles.cookieCard}>
              <div className={styles.icon}>💾</div>
              <h3>{t('cookies.duration_subtitle2')}</h3>
              <p>{t('cookies.duration_text2')}</p>
            </div>
          </div>
          <h3>{t('cookies.type_subtitle2')}</h3>
          <div className={styles.cookieTypes}>
            <div className={styles.cookieCard}>
              <div className={styles.icon}>🏠</div>
              <h3>{t('cookies.origin_subtitle1')}</h3>
              <p>{t('cookies.origin_text1')}</p>
            </div>
            <div className={styles.cookieCard}>
              <div className={styles.icon}>🌐</div>
              <h3>{t('cookies.origin_subtitle2')}</h3>
              <p>{t('cookies.origin_text2')}</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>{t('cookies.why_title')}</h2>
          <div className={styles.purposesGrid}>
            <div className={styles.purposeCard}>
              <div className={styles.icon}>🔧</div>
              <h3>{t('cookies.why_subtitle1')}</h3>
              <p>{t('cookies.why_text1')}</p>
            </div>
            <div className={styles.purposeCard}>
              <div className={styles.icon}>📊</div>
              <h3>{t('cookies.why_subtitle2')}</h3>
              <p>{t('cookies.why_text2')}</p>
            </div>
            <div className={styles.purposeCard}>
              <div className={styles.icon}>⚙️</div>
              <h3>{t('cookies.why_subtitle3')}</h3>
              <p>{t('cookies.why_text3')}</p>
            </div>
            <div className={styles.purposeCard}>
              <div className={styles.icon}>📣</div>
              <h3>{t('cookies.why_subtitle4')}</h3>
              <p>{t('cookies.why_text4')}</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>{t('cookies.use_title')}</h2>

          <h3>{t('cookies.use_subtitle1')}</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>{t('cookies.use1_header1')}</th>
                  <th>{t('cookies.use1_header2')}</th>
                  <th>{t('cookies.use1_header3')}</th>
                  <th>{t('cookies.cookie1_use1_header4')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>session_id</code>
                  </td>
                  <td>{t('cookies.cookie1_header2_text1')}</td>
                  <td>
                    <span className={styles.badgeRequired}>{t('cookies.cookie1_header3_text1')}</span>
                  </td>
                  <td>{t('cookies.cookie1_header4_text1')}</td>
                </tr>
                <tr>
                  <td>
                    <code>csrf_token</code>
                  </td>
                  <td>{t('cookies.cookie1_header2_text1')}</td>
                  <td>
                    <span className={styles.badgeRequired}>{t('cookies.cookie1_header3_text2')}</span>
                  </td>
                  <td>{t('cookies.cookie1_header4_text2')}</td>
                </tr>
                <tr>
                  <td>
                    <code>user_prefs</code>
                  </td>
                  <td>{t('cookies.cookie1_header2_text2')}</td>
                  <td>
                    <span className={styles.badgeOptional}>{t('cookies.cookie1_header3_text2')}</span>
                  </td>
                  <td>{t('cookies.cookie1_header4_text3')}</td>
                </tr>
                <tr>
                  <td>
                    <code>cookie_consent</code>
                  </td>
                  <td>{t('cookies.cookie1_header2_text2')}</td>
                  <td>
                    <span className={styles.badgeRequired}>{t('cookies.cookie1_header3_text1')}</span>
                  </td>
                  <td>{t('cookies.cookie1_header4_text4')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>{t('cookies.use_subtitle2')}</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>{t('cookies.use1_header1')}</th>
                  <th>{t('cookies.use1_header2')}</th>
                  <th>{t('cookies.cookie1_use1_header4')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>_ga</code>
                  </td>
                  <td>{t('cookies.cookie2_header2_text1')}</td>
                  <td>{t('cookies.cookie2_header3_text1')}</td>
                </tr>
                <tr>
                  <td>
                    <code>_gid</code>
                  </td>
                  <td>{t('cookies.cookie2_header2_text2')}</td>
                  <td>{t('cookies.cookie2_header3_text2')}</td>
                </tr>
                <tr>
                  <td>
                    <code>_gat</code>
                  </td>
                  <td>{t('cookies.cookie2_header2_text3')}</td>
                  <td>{t('cookies.cookie2_header3_text3')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>{t('cookies.use_subtitle3')}</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>{t('cookies.use1_header1')}</th>
                  <th>{t('cookies.use3_header2')}</th>
                  <th>{t('cookies.use1_header2')}</th>
                  <th>{t('cookies.cookie1_use1_header4')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>_fbp</code>
                  </td>
                  <td>Meta</td>
                  <td>{t('cookies.cookie3_header3_text1')}</td>
                  <td>{t('cookies.cookie3_header4_text1')}</td>
                </tr>
                <tr>
                  <td>
                    <code>IDE</code>
                  </td>
                  <td>Google</td>
                  <td>{t('cookies.cookie1_header2_text2')}</td>
                  <td>{t('cookies.cookie3_header4_text2')}</td>
                </tr>
                <tr>
                  <td>
                    <code>VISITOR_INFO1_LIVE</code>
                  </td>
                  <td>YouTube</td>
                  <td>{t('cookies.cookie3_header3_text2')}</td>
                  <td>{t('cookies.cookie3_header4_text3')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.section}>
          <h2>{t('cookies.manage_title')}</h2>
          <p>{t('cookies.manage_text1')}</p>
          <p>{t('cookies.manage_text2')}</p>
          <ul>
            <li>
              <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
                Google Chrome
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
              >
                Apple Safari
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
                target="_blank"
                rel="noopener noreferrer"
              >
                Microsoft Edge
              </a>
            </li>
          </ul>
          <p style={{ marginTop: '12px' }}>{t('cookies.manage_text3')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('cookies.thirdparty_title')}</h2>
          <p>{t('cookies.thirdparty_text1')}</p>
          <div className={styles.infoCard}>
            <strong>Google Analytics</strong>
            <p>
              {t('cookies.thirdparty_card1_text')}
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                {t('cookies.thirdparty_card1_link1')}
              </a>
              {t('cookies.thirdparty_card1_text_pt2')}
            </p>
          </div>
          <div className={styles.infoCard}>
            <strong>Meta (Facebook / Instagram)</strong>
            <p>
              {t('cookies.thirdparty_card2_text')}
              <a href="https://www.facebook.com/ads/preferences" target="_blank" rel="noopener noreferrer">
                {t('cookies.thirdparty_card2_link')}
              </a>
            </p>
          </div>
          <div className={styles.infoCard}>
            <strong>{t('cookies.thirdparty_card3_title')}</strong>
            <p>
              {t('cookies.thirdparty_card3_text')}
              <a href="http://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer">
                {t('cookies.thirdparty_card3_link')}
              </a>
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>{t('cookies.changes_title')}</h2>
          <p>{t('cookies.changes_text')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('cookies.contact_title')}</h2>
          <div className={styles.contactBox}>
            <div className={styles.text}>
              <h3>{t('cookies.contact_subtitle')}</h3>
              <p>{t('cookies.contact_text')}</p>
            </div>
            <a href="mailto:privacy@allcourts.com">{t('cookies.contact_button')}</a>
          </div>
        </section>
      </div>
    </div>
  );
}
