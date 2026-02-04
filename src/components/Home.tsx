import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Alert } from 'react-bootstrap';
import { getUserInfo, doLogout, isAuthenticated } from '../utils/authUtils';
import { UserInfo } from '../types/auth.types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Verifica se o usuário está autenticado
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Obtém as informações do usuário
    const info = getUserInfo();
    if (info) {
      setUserInfo(info);
    } else {
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = (): void => {
    doLogout();
  };

  if (loading || !userInfo) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-house-door-fill me-2"></i>
                Bem-vindo ao Finance App
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="mb-4 text-center">
                <div className="mb-3">
                  <i className="bi bi-person-circle" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                </div>
                <h3 className="mb-2">{userInfo.name}</h3>
                {userInfo.email && (
                  <p className="text-muted mb-1">
                    <i className="bi bi-envelope me-2"></i>
                    {userInfo.email}
                  </p>
                )}
                <p className="text-muted">
                  <i className="bi bi-person-badge me-2"></i>
                  @{userInfo.username}
                </p>
              </div>

              <Card className="mb-4 bg-light border-0">
                <Card.Body>
                  <h5 className="mb-3">
                    <i className="bi bi-shield-check me-2 text-info"></i>
                    Suas Permissões (Roles)
                  </h5>
                  {userInfo.roles && userInfo.roles.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {userInfo.roles.map((role, index) => (
                        <Badge
                          key={index}
                          bg="info"
                          className="px-3 py-2"
                          style={{ fontSize: '0.9rem' }}
                        >
                          <i className="bi bi-patch-check-fill me-1"></i>
                          {role}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <Alert variant="secondary" className="mb-0">
                      <i className="bi bi-info-circle me-2"></i>
                      Nenhuma permissão atribuída
                    </Alert>
                  )}
                </Card.Body>
              </Card>

              <div className="d-grid gap-2">
                <Button variant="danger" onClick={handleLogout} size="lg">
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Sair da Conta
                </Button>
              </div>
            </Card.Body>
          </Card>

          <div className="text-center mt-3">
            <small className="text-muted">
              <i className="bi bi-lock-fill me-1"></i>
              Autenticado via Keycloak
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
