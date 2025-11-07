import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TargetHistory from './components/TargetHistory';

function App() {
  const [token, setToken] = useState<string | null>(null);

  const [viewingTargetId, setViewingTargetId] = useState<number | null>(null);

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
  };

  const showDashboard = () => {
    setViewingTargetId(null);
  };

  const showHistory = (targetId: number) => {
    setViewingTargetId(targetId);
  };

  return (
    <div>
      <h1>Uptime Monitor</h1>

      {!token && <Login onLoginSuccess={handleLoginSuccess} />}

      {token && !viewingTargetId && (
        <Dashboard 
          token={token} 
          onViewHistory={showHistory}
        />
      )}

      {token && viewingTargetId && (
        <TargetHistory 
          token={token} 
          targetId={viewingTargetId} 
          onBack={showDashboard}
        />
      )}
    </div>
  );
}

export default App;