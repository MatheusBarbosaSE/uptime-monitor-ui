import { useState, useEffect, useCallback } from 'react';
import { type HealthCheck, type ApiResponsePage } from '../types/history.types';
import { getHistoryApi } from '../services/apiService';

import { 
  Table, 
  Button, 
  Group, 
  Paper, 
  Title, 
  Text, 
  Center, 
  Loader,
  Alert
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

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

  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');
  const [appliedStartDate, setAppliedStartDate] = useState<string | undefined>(undefined);
  const [appliedEndDate, setAppliedEndDate] = useState<string | undefined>(undefined);

  const fetchHistory = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await getHistoryApi(targetId, token, page, appliedStartDate, appliedEndDate);
      setHistoryPage(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch history for this target.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [targetId, token, appliedStartDate, appliedEndDate]);

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
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startDateUTC = tempStartDate ? `${tempStartDate}T00:00:00Z` : undefined;
    const endDateUTC = tempEndDate ? `${tempEndDate}T23:59:59Z` : undefined;
    setAppliedStartDate(startDateUTC);
    setAppliedEndDate(endDateUTC);
    setCurrentPage(0);
  };

  const renderContent = () => {
    if (loading) {
      return <Center><Loader /></Center>;
    }
    if (error) {
      return <Alert color="red" title="Error" icon={<IconAlertCircle />}>{error}</Alert>;
    }
    if (!historyPage || historyPage.empty) {
      return <Text>No history found for this target (or selected date range).</Text>;
    }

    const rows = historyPage.content.map((check) => (
      <Table.Tr key={check.id}>
        <Table.Td>{new Date(check.checkedAt).toLocaleString()}</Table.Td>
        <Table.Td>
          <Text c={check.statusMessage === 'ONLINE' ? 'green' : 'red'} fw={500}>
            {check.statusMessage}
          </Text>
        </Table.Td>
        <Table.Td>{check.statusCode || 'N/A'}</Table.Td>
      </Table.Tr>
    ));

    return (
      <>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Checked At</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Code</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>

        <Group justify="space-between" mt="md">
          <Button variant="default" onClick={goToPrevPage} disabled={historyPage.first}>
            &larr; Previous
          </Button>
          <Text>
            Page {historyPage.number + 1} of {historyPage.totalPages}
          </Text>
          <Button variant="default" onClick={goToNextPage} disabled={historyPage.last}>
            Next &rarr;
          </Button>
        </Group>
      </>
    );
  };

  return (
    <Paper withBorder shadow="md" p="lg" radius="md">
      <Group justify="space-between" mb="md">
        <Title order={2}>Target History (ID: {targetId})</Title>
        <Button variant="outline" onClick={onBack}>&larr; Back to Dashboard</Button>
      </Group>

      <form onSubmit={handleFilterSubmit} style={{ margin: '10px 0' }}>
        <Group grow>
          <input 
            type="date" 
            id="startDate"
            value={tempStartDate}
            onChange={(e) => setTempStartDate(e.target.value)}
          />
          <input 
            type="date" 
            id="endDate"
            value={tempEndDate}
            onChange={(e) => setTempEndDate(e.target.value)}
          />
          <Button type="submit">Filter</Button>
        </Group>
      </form>

      <hr style={{ margin: '20px 0' }} />

      {renderContent()}
    </Paper>
  );
};

export default TargetHistory;