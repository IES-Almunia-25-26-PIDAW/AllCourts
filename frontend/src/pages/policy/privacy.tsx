import { useTranslation } from 'react-i18next';
import styles from './Privacy.module.scss';

/**
 * @page PrivacyPolicy
 * Documento de política de privacidad de la plataforma.
 */
export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1>{t('privacy.title')}</h1>
          <p>{t('privacy.subtitle')}</p>
          <div className={styles.heroMeta}>
            <span>{t('privacy.main_msg1')}</span>
            <span>{t('privacy.main_msg2')}</span>
          </div>
        </div>
      </section>

      <div className={styles.pageWrap}>
        <section className={styles.section}>
          <h2>{t('privacy.responsible_title')}</h2>
          <p>{t('privacy.responsible_text1')}</p>
          <div className={styles.infoCard}>
            <strong>{t('privacy.responsible_data_title')}</strong>
            <p>
              <strong>{t('privacy.responsible_reason')}</strong> {t('privacy.responsible_reason_text')}
              <br />
              <strong>{t('privacy.responsible_CIF')}</strong> {t('privacy.responsible_CIF_text')}
              <br />
              <strong>{t('privacy.responsible_home')}</strong> {t('privacy.responsible_home_text')}
              <br />
              <strong>{t('privacy.responsible_email')}</strong> {t('privacy.responsible_email_text')}
              <br />
              <strong>{t('privacy.responsible_DPO')}</strong> {t('privacy.responsible_DPO_text')}
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>{t('privacy.finality_title')}</h2>
          <p>{t('privacy.finality_text1')}</p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>{t('privacy.finality_finality_title')}</th>
                  <th>{t('privacy.finality_treatment_title')}</th>
                  <th>{t('privacy.finality_legal_title')}</th>
                  <th>{t('privacy.finality_conserv_title')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t('privacy.finality_finality_text1')}</td>
                  <td>{t('privacy.finality_treatment_text1')}</td>
                  <td>
                    <span className={styles.badgeBlue}>{t('privacy.finality_legal_text1')}</span>
                  </td>
                  <td>{t('privacy.finality_conserv_text1')}</td>
                </tr>
                <tr>
                  <td>{t('privacy.finality_finality_text2')}</td>
                  <td>{t('privacy.finality_treatment_text2')}</td>
                  <td>
                    <span className={styles.badgeBlue}>{t('privacy.finality_legal_text1')}</span>
                  </td>
                  <td>{t('privacy.finality_conserv_text1')}</td>
                </tr>
                <tr>
                  <td>{t('privacy.finality_finality_text3')}</td>
                  <td>{t('privacy.finality_treatment_text3')}</td>
                  <td>
                    <span className={styles.badgeBlue}>{t('privacy.finality_legal_text1')}</span>
                  </td>
                  <td>{t('privacy.finality_conserv_text2')}</td>
                </tr>
                <tr>
                  <td>{t('privacy.finality_finality_text4')}</td>
                  <td>{t('privacy.finality_treatment_text4')}</td>
                  <td>
                    <span className={styles.badgeGreen}>{t('privacy.finality_legal_text2')}</span>
                  </td>
                  <td>{t('privacy.finality_conserv_text3')}</td>
                </tr>
                <tr>
                  <td>{t('privacy.finality_finality_text5')}</td>
                  <td>{t('privacy.finality_treatment_text5')}</td>
                  <td>
                    <span className={styles.badgeGreen}>{t('privacy.finality_legal_text2')}</span>
                  </td>
                  <td>{t('privacy.finality_conserv_text3')}</td>
                </tr>
                <tr>
                  <td>{t('privacy.finality_finality_text6')}</td>
                  <td>{t('privacy.finality_treatment_text6')}</td>
                  <td>
                    <span className={styles.badgeBlue}>{t('privacy.finality_legal_text3')}</span>
                  </td>
                  <td>{t('privacy.finality_conserv_text4')}</td>
                </tr>
                <tr>
                  <td>{t('privacy.finality_finality_text7')}</td>
                  <td>{t('privacy.finality_treatment_text7')}</td>
                  <td>
                    <span className={styles.badgeBlue}>{t('privacy.finality_legal_text3')}</span>
                  </td>
                  <td>{t('privacy.finality_conserv_text5')}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3>{t('privacy.finality_notification_title')}</h3>
          <p>{t('privacy.finality_notification_text')}</p>
          <p>{t('privacy.finality_notification_text2')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('privacy.collect_title')}</h2>
          <div className={styles.infoCard}>
            <strong>{t('privacy.collect_subtitle1')}</strong>
            <p>{t('privacy.collect_text1')}</p>
          </div>
          <div className={styles.infoCard}>
            <strong>{t('privacy.collect_subtitle2')}</strong>
            <p>{t('privacy.collect_text2')}</p>
          </div>
          <div className={styles.infoCard}>
            <strong>{t('privacy.collect_subtitle3')}</strong>
            <p>{t('privacy.collect_text3')}</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>{t('privacy.share_title')}</h2>
          <p>{t('privacy.share_text1')}</p>
          <ul>
            <li>{t('privacy.share_li1')}</li>
            <li>{t('privacy.share_li2')}</li>
            <li>{t('privacy.share_li3')}</li>
            <li>{t('privacy.share_li4')}</li>
            <li>{t('privacy.share_li5')}</li>
          </ul>
          <div className={styles.highlightBox}>
            <p>{t('privacy.share_box')}</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>{t('privacy.rights_title')}</h2>
          <p>{t('privacy.rights_text1')}</p>
          <div className={styles.rightsGrid}>
            <div className={styles.rightCard}>
              <div className={styles.icon}>👁️</div>
              <h4>{t('privacy.rights_box1_title')}</h4>
              <p>{t('privacy.rights_box1_text')}</p>
            </div>
            <div className={styles.rightCard}>
              <div className={styles.icon}>✏️</div>
              <h4>{t('privacy.rights_box2_title')}</h4>
              <p>{t('privacy.rights_box2_text')}</p>
            </div>
            <div className={styles.rightCard}>
              <div className={styles.icon}>🗑️</div>
              <h4>{t('privacy.rights_box3_title')}</h4>
              <p>{t('privacy.rights_box3_text')}</p>
            </div>
            <div className={styles.rightCard}>
              <div className={styles.icon}>⏸️</div>
              <h4>{t('privacy.rights_box4_title')}</h4>
              <p>{t('privacy.rights_box4_text')}</p>
            </div>
            <div className={styles.rightCard}>
              <div className={styles.icon}>📦</div>
              <h4>{t('privacy.rights_box5_title')}</h4>
              <p>{t('privacy.rights_box5_text')}</p>
            </div>
            <div className={styles.rightCard}>
              <div className={styles.icon}>🚫</div>
              <h4>{t('privacy.rights_box6_title')}</h4>
              <p>{t('privacy.rights_box6_text')}</p>
            </div>
          </div>
          <p style={{ marginTop: '20px' }}>
            {t('privacy.rights_text2')}
            <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
              {t('privacy.rights_text3')}
            </a>
            .
          </p>
        </section>

        <section className={styles.section}>
          <h2>{t('privacy.security_title')}</h2>
          <p>{t('privacy.security_text')}</p>
          <ul>
            <li>{t('privacy.security_li1')}</li>
            <li>{t('privacy.security_li2')}</li>
            <li>{t('privacy.security_li3')}</li>
            <li>{t('privacy.security_li4')}</li>
            <li>{t('privacy.security_li5')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('privacy.minor_title')}</h2>
          <div className={styles.highlightBox}>
            <p>{t('privacy.minor_text')}</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>{t('privacy.changes_title')}</h2>
          <p>{t('privacy.changes_text')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('privacy.contact_title')}</h2>
          <div className={styles.contactBox}>
            <div className={styles.text}>
              <h3>{t('privacy.contact_header')}</h3>
              <p>{t('privacy.contact_text')}</p>
            </div>
            <a href="mailto:privacidad@tudominio.com">{t('privacy.contact_button')}</a>
          </div>
        </section>
      </div>
    </div>
  );
}
