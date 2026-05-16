import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Estado estándar de carga asíncrona para hooks de datos.
 *
 * @template T
 */
export type AsyncResourceState<T> = {
	data: T | null;
	loading: boolean;
	error: string | null;
};

/**
 * Ejecuta un loader asíncrono y expone su estado de forma segura para React.
 *
 * @template T
 * @param loader Función que devuelve los datos.
 * @param enabled Si es false, no dispara la carga.
 * @returns {AsyncResourceState<T>} Estado con datos, carga y error.
 */
export function useAsyncResource<T>(
	loader: () => Promise<T>,
	enabled = true,
): AsyncResourceState<T> {
	const { t } = useTranslation();
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!enabled) {
			setData(null);
			setLoading(false);
			setError(null);
			return;
		}

		let cancelled = false;

		const load = async () => {
			try {
				setLoading(true);
				setError(null);
				const nextData = await loader();
				if (!cancelled) {
					setData(nextData);
				}
			} catch (err) {
				if (!cancelled) {
					setData(null);
					setError(
						err instanceof Error
							? err.message
							: t("errors.could_not_load"),
					);
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		};

		void load();

		return () => {
			cancelled = true;
		};
	}, [enabled, loader]);

	return { data, loading, error };
}
