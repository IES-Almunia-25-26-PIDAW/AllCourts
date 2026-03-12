import React, { ReactNode } from 'react';
import Link from 'next/link';
import { withTranslation, WithTranslation } from 'react-i18next';

interface Props extends WithTranslation {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary atrapó un error:", error, errorInfo);
    }

    render() {
        const { t } = this.props;
        
        if (this.state.hasError) {
            return (
                <div>
                    <h1>{t('errorBoundary.title')}</h1>
                    <p>{t('errorBoundary.message')}</p>
                    <Link href="/">{t('errorBoundary.action')}</Link>
                </div>
            );
        }

        return this.props.children;
    }
}

export default withTranslation()(ErrorBoundary);