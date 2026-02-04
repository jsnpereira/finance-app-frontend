import React, { useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { doRegister } from '../utils/authUtils';

const Cadastro: React.FC = () => {
  useEffect(() => {
    // Redireciona automaticamente para o cadastro do Keycloak
    doRegister();
  }, []);

  return (
    <Container className="mt-5">
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="success" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3 text-muted">Redirecionando para cadastro...</p>
      </div>
    </Container>
  );
};

export default Cadastro;
