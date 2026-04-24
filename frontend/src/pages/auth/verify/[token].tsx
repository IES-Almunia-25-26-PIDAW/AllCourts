import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { request } from "@/api/http";
import styles from "./[token].module.scss";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Verificando tu cuenta...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const token = router.query.token;

    if (typeof token !== "string" || !token) {
      setMessage("No se encontró el token de verificación.");
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        await request<{ message: string }>(`/auth/verify/${token}`, {
          method: "GET",
        });
        setMessage(
          "Tu cuenta se ha verificado correctamente. Ya puedes iniciar sesión.",
        );
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "No se pudo verificar la cuenta.",
        );
      } finally {
        setLoading(false);
      }
    };

    void verifyEmail();
  }, [router.isReady, router.query.token]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Verificación de cuenta</h1>

        <p className={styles.message}>
          {loading ? "Comprobando tu enlace..." : message}
        </p>

        <div className={styles.actions}>
          <Link href="/login" className={styles.primaryButton}>
            Ir a iniciar sesión
          </Link>

          <Link href="/" className={styles.secondaryButton}>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
