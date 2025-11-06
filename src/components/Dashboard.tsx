import { useState, useEffect } from 'react';
import { getTargetsApi } from '../services/apiService';
import { type Target } from '../types/target.types';

interface DashboardProps {
  token: string;
}

const Dashboard = ({ token }: DashboardProps) => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const response = await getTargetsApi(token);

        setTargets(response.data);
      } catch (err) {
        setError('Failed to fetch targets. Please try logging in again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTargets();
  }, [token]);

  if (loading) {
    return <div>Loading your dashboard...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h2>Your Targets</h2>
      {targets.length === 0 ? (
        <p>You don't have any targets yet. Go create one!</p>
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