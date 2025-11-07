import { useState, useEffect, useCallback } from 'react';
import { type HealthCheck, type ApiResponsePage } from '../types/history.types';
import { getHistoryApi } from '../services/apiService';

interface TargetHistoryProps {
  token: string;
  targetId: number;
  onBack: () => void;
}

const TargetHistory = ({ token, targetId, onBack }: TargetHistoryProps) => {
  const [historyPage, setHistoryPage] = useState<ApiResponsePage<HealthCheck> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await getHistoryApi(targetId, token, page);
      setHistoryPage(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch history for this target.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [targetId, token]);

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage, fetchHistory]);

  const goToNextPage = () => {
    if (historyPage && !historyPage.last) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (historyPage && !historyPage.first) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <p>Loading history...</p>;
    }
    if (error) {
      return <p style={{ color: 'red' }}>{error}</p>;
    }
    if (!historyPage || historyPage.empty) {
      return <p>No history found for this target yet.</p>;
    }

    return (
      <>
        <table border={1} cellPadding={5} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Checked At</th>
              <th>Status</th>
              <th>Code</th>
            </tr>
          </thead>
          <tbody>
            {historyPage.content.map((check) => (
              <tr key={check.id}>
                <td>{new Date(check.checkedAt).toLocaleString()}</td>
                <td>{check.statusMessage}</td>
                <td>{check.statusCode}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '10px' }}>
          <button onClick={goToPrevPage} disabled={historyPage.first}>
            &larr; Previous
          </button>
          <span style={{ margin: '0 10px' }}>
            Page {historyPage.number + 1} of {historyPage.totalPages}
          </span>
          <button onClick={goToNextPage} disabled={historyPage.last}>
            Next &rarr;
          </button>
        </div>
      </>
    );
  };

  return (
    <div>
      <button onClick={onBack}>&larr; Back to Dashboard</button>
      <h2>History for Target ID: {targetId}</h2>
      {renderContent()}
    </div>
  );
};

export default TargetHistory;