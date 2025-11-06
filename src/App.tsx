import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState<string | null>(null);

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
  };

  return (
    <div>
      <h1>Uptime Monitor</h1>

      {!token && (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}

      {token && (
        <Dashboard token={token} />
      )}

    </div>
  );
}

export default App;