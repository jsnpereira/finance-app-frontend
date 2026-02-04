import React, { useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { doLogin } from '../utils/authUtils';

const Login: React.FC = () => {
  useEffect(() => {
    // Redireciona automaticamente para o Keycloak
    doLogin();
  }, []);

  return (
    <Container className="mt-5">
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3 text-muted">Redirecionando para autenticação...</p>
      </div>
    </Container>
  );
};

export default Login;
