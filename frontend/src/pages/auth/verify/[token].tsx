import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouteQueryParam } from "@/hooks/useRouteQueryParam";
import styles from "./[token].module.scss";

/**
 * @page VerifyEmail
 * Página para verificar la cuenta mediante un token enviado por correo.
 */
export default function VerifyEmailPage() {
	const { verifyEmail } = useAuth();
	const { ready, value: token } = useRouteQueryParam("token");
	const [message, setMessage] = useState("Verificando tu cuenta...");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (typeof token !== "string" || !token) {
			setMessage("No se encontró el token de verificación.");
			setLoading(false);
			return;
		}

		const verify = async () => {
			try {
				await verifyEmail(token);
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

		void verify();
	}, [ready, token, verifyEmail]);

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
