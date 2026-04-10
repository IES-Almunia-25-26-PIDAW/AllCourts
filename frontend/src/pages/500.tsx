//#region MODULES
import Link from "next/link";
import { useTranslation } from "react-i18next";
import styles from "@/styles/pages/404.module.scss";
//#endregion

//#region DOCUMENTATION
/**
 * @page Custom500
 * Página de error 500 personalizada que Next.js muestra cuando
 * ocurre un error interno en el servidor.
 * Muestra un mensaje traducido y un enlace para volver al inicio.
 *
 * Comportamiento:
 *   - Mantiene el mismo diseño de fallback que la 404 para coherencia visual.
 *   - Da una salida rápida al usuario hacia la home.
 */
//#endregion

//#region FUNCTIONS
export default function Custom500() {
  //#region VARIABLES
  const { t } = useTranslation();
  //#endregion

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>500</h1>
      <h2 className={styles.subtitle}>{t("500.title")}</h2>
      <p className={styles.message}>{t("500.message")}</p>
      <Link href="/" className={styles.homeLink}>
        {t("500.action")}
      </Link>
    </div>
  );
}
//#endregion
