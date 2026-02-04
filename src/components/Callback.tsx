import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { handleAuthCallback } from '../utils/authUtils';

const Callback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Processa o callback e obtém informações do usuário
        await handleAuthCallback();
        
        // Redireciona para a página home após login/cadastro bem-sucedido
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 500);
      } catch (err) {
        console.error('Erro no callback:', err);
        setError('Erro ao processar autenticação. Redirecionando para login...');
        
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    processCallback();
  }, [navigate]);

  return (
    <Container className="mt-5">
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        {error ? (
          <Alert variant="danger" className="text-center">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        ) : (
          <>
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3 text-muted">Processando autenticação...</p>
          </>
        )}
      </div>
    </Container>
  );
};

export default Callback;
