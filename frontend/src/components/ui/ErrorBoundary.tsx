//#region MODULES
import React, { ReactNode } from "react";
import Link from "next/link";
import { withTranslation, WithTranslation } from "react-i18next";
//#endregion

/**
 * @component ErrorBoundary
 * Componente de clase que captura errores de renderizado en cualquier
 * parte del árbol de componentes hijo, evitando que la app entera se rompa.
 * Muestra una pantalla de error amigable con un enlace para volver al inicio.
 *
 * Propiedades:
 *   children → componentes hijos que quedan protegidos por el boundary
 *   t        → función de traducción inyectada por withTranslation
 *
 * Uso:
 *   <ErrorBoundary>
 *     <ComponenteQuePuedeFallar />
 *   </ErrorBoundary>
 */

//#region TYPES
interface Props extends WithTranslation {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}
//#endregion

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Método estático del ciclo de vida de React.
   * Se ejecuta antes del render cuando un hijo lanza un error.
   * Actualiza el estado para activar la pantalla de error.
   */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary atrapó un error:", error, errorInfo);
  }

  render() {
    const { t } = this.props;

    // Si hay error, sustituye el árbol hijo por la pantalla de reserva
    if (this.state.hasError) {
      return (
        <div>
          <h1>{t("errorBoundary.title")}</h1>
          <p>{t("errorBoundary.message")}</p>
          <Link href="/">{t("errorBoundary.action")}</Link>
        </div>
      );
    }

    // Sin errores, renderiza los hijos con normalidad
    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
