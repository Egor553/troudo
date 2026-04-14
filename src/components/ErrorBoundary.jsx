import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Critical Frontend Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary-view container" style={{ padding: '100px 20px', textAlign: 'center' }}>
                    <div className="glass" style={{ padding: '60px', borderRadius: '24px' }}>
                        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>⚡ Что-то пошло не так</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '30px' }}>
                            Произошла непредвиденная ошибка в интерфейсе. Попробуйте обновить страницу.
                        </p>
                        <button
                            className="btn-primary"
                            onClick={() => window.location.reload()}
                            style={{ padding: '12px 32px' }}
                        >
                            Обновить страницу
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
