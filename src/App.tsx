import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TargetHistory from './components/TargetHistory';

import { Container, Title, Space, Center } from '@mantine/core';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [viewingTargetId, setViewingTargetId] = useState<number | null>(null);

  const handleLoginSuccess = (newToken: string) => { setToken(newToken); };
  const showDashboard = () => { setViewingTargetId(null); };
  const showHistory = (targetId: number) => { setViewingTargetId(targetId); };

  return (
    <Center style={{ minHeight: '100vh' }}> 
    
      <Container size="md" style={{ width: '100%' }}>
    
        <Title order={1} ta="center">
          Uptime Monitor
        </Title>

        <Space h="xl" /> 

        {!token && <Login onLoginSuccess={handleLoginSuccess} />}
        {token && !viewingTargetId && (
          <Dashboard token={token} onViewHistory={showHistory} />
        )}
        {token && viewingTargetId && (
          <TargetHistory 
            token={token} 
            targetId={viewingTargetId} 
            onBack={showDashboard} 
          />
        )}
      </Container>
    </Center>
  );
}

export default App;