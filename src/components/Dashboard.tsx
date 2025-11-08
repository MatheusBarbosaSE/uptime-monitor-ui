import { useState, useEffect, useCallback } from 'react';
import { getTargetsApi, deleteTargetApi } from '../services/apiService';
import { type Target } from '../types/target.types';
import CreateTarget from './CreateTarget';
import EditTarget from './EditTarget';

interface DashboardProps {
  token: string;
  onViewHistory: (targetId: number) => void;
}

const Dashboard = ({ token, onViewHistory }: DashboardProps) => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingTargetId, setEditingTargetId] = useState<number | null>(null);

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

  const handleDelete = async (targetId: number) => {
    if (!window.confirm('Are you sure you want to delete this target?')) {
      return;
    }
    try {
      await deleteTargetApi(targetId, token);
      fetchTargets();
    } catch (err) {
      console.error('Failed to delete target:', err);
      setError('Failed to delete target.');
    }
  };

  const handleUpdateComplete = () => {
    setEditingTargetId(null);
    fetchTargets();
  };

  if (editingTargetId) {
    return (
      <EditTarget
        token={token}
        targetId={editingTargetId}
        onUpdateComplete={handleUpdateComplete}
      />
    );
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <CreateTarget token={token} onTargetCreated={fetchTargets} />
      <hr />
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

              <button 
                onClick={() => setEditingTargetId(target.id)}
                style={{ marginLeft: '10px' }}
              >
                Edit
              </button>
              <button 
                onClick={() => onViewHistory(target.id)}
                style={{ marginLeft: '10px' }}
              >
                View History
              </button>
              <button 
                onClick={() => handleDelete(target.id)}
                style={{ marginLeft: '10px' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;