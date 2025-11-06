import { useState, useEffect, useCallback } from 'react';
import { getTargetsApi } from '../services/apiService';
import { type Target } from '../types/target.types';
import CreateTarget from './CreateTarget';

interface DashboardProps {
  token: string;
}

const Dashboard = ({ token }: DashboardProps) => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTargets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getTargetsApi(token);
      setTargets(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch targets. Please try logging in again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTargets();
  }, [fetchTargets]);

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <CreateTarget token={token} onTargetCreated={fetchTargets} />

      <h2>Your Targets</h2>
      {loading ? (
        <p>Loading targets...</p>
      ) : targets.length === 0 ? (
        <p>You don't have any targets yet. Use the form above to add one!</p>
      ) : (
        <ul>
          {targets.map((target) => (
            <li key={target.id}>
              <strong>{target.name}</strong> ({target.url}) - Checks every {target.checkInterval} min
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;