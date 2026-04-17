import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function VerifyEmailPage() {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState("Verificando tu correo...");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (typeof token !== "string" || !token) {
      setMessage("No se encontró el token de verificación.");
      setIsError(true);
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/verify/${token}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "No se pudo verificar el correo.");
        }

        setMessage(data?.message || "Correo verificado correctamente.");
        setIsError(false);
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "No se pudo verificar el correo."
        );
        setIsError(true);
      }
    };

    verifyEmail();
  }, [router.isReady, token]);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", background: "#f4f7fb" }}>
      <section style={{ maxWidth: "560px", width: "100%", background: "white", borderRadius: "16px", padding: "2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", textAlign: "center" }}>
        <h1 style={{ marginBottom: "1rem", fontSize: "2rem" }}>{isError ? "Verificación fallida" : "Verificación de correo"}</h1>
        <p style={{ marginBottom: "1.5rem", color: "#334155", lineHeight: 1.6 }}>{message}</p>
        <Link href="/login" style={{ display: "inline-block", padding: "0.8rem 1.2rem", borderRadius: "999px", background: "#0f62fe", color: "white", textDecoration: "none", fontWeight: 600 }}>
          Ir a iniciar sesión
        </Link>
      </section>
    </main>
  );
}
