import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TargetHistory from './components/TargetHistory';
import Register from './components/Register';

import { Container, Title, Space, Center } from '@mantine/core';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [viewingTargetId, setViewingTargetId] = useState<number | null>(null);

  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = (newToken: string) => { setToken(newToken); };
  const showDashboard = () => { setViewingTargetId(null); };
  const showHistory = (targetId: number) => { setViewingTargetId(targetId); };

  const navigateToLogin = () => { setShowRegister(false); };
  const navigateToRegister = () => { setShowRegister(true); };

  const renderMainContent = () => {
    if (token) {
      if (viewingTargetId) {
        return (
          <TargetHistory 
            token={token} 
            targetId={viewingTargetId} 
            onBack={showDashboard} 
          />
        );
      }
      return (
        <Dashboard 
          token={token} 
          onViewHistory={showHistory} 
        />
      );
    }

    if (showRegister) {
      return (
        <Register 
          onRegisterSuccess={handleLoginSuccess} 
          onShowLogin={navigateToLogin} 
        />
      );
    }
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess} 
        onShowRegister={navigateToRegister} 
      />
    );
  };

  return (
    <Center style={{ minHeight: '100vh' }}> 
      <Container size="md" style={{ width: '100%' }}>
        <Title order={1} ta="center">
          Uptime Monitor
        </Title>
        <Space h="xl" /> 

        {renderMainContent()}

      </Container>
    </Center>
  );
}

export default App;