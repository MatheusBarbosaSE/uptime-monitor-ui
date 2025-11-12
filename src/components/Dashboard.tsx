import { useState, useEffect, useCallback } from 'react';
import { getTargetsApi, deleteTargetApi } from '../services/apiService';
import { type Target } from '../types/target.types';
import CreateTarget from './CreateTarget';
import EditTarget from './EditTarget';

import { 
  Paper, 
  Title, 
  Text, 
  Table, 
  Button, 
  Group, 
  Loader, 
  Alert,
  Center
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface DashboardProps {
  token: string;
  onViewHistory: (targetId: number) => void;
  onViewAccount: () => void;
}

const Dashboard = ({ token, onViewHistory, onViewAccount }: DashboardProps) => {
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
    return (
      <Alert color="red" title="Error" icon={<IconAlertCircle />}>
        {error}
      </Alert>
    );
  }

  const rows = targets.map((target) => (
    <Table.Tr key={target.id}>
      <Table.Td>
        <Text fw={500}>{target.name}</Text>
      </Table.Td>
      <Table.Td>
        <Text c="dimmed">{target.url}</Text>
      </Table.Td>
      <Table.Td>{target.checkInterval} min</Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end">
          <Button 
            variant="outline" 
            size="xs" 
            onClick={() => setEditingTargetId(target.id)}
          >
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="xs" 
            onClick={() => onViewHistory(target.id)}
          >
            History
          </Button>
          <Button 
            variant="filled" 
            color="red" 
            size="xs" 
            onClick={() => handleDelete(target.id)}
          >
            Delete
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper withBorder shadow="md" p="lg" radius="md">
      
      <Group justify="space-between" mb="lg">
        <Title order={2}>Dashboard</Title>
        <Button variant="outline" onClick={onViewAccount}>
          My Account
        </Button>
      </Group>

      <CreateTarget token={token} onTargetCreated={fetchTargets} />

      <hr style={{ margin: '20px 0' }} />

      <Title order={3} mb="md">Your Targets</Title>

      {loading ? (
        <Center><Loader /></Center>
      ) : targets.length === 0 ? (
        <Text>You don't have any targets yet. Use the form above to add one!</Text>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>URL</Table.Th>
              <Table.Th>Interval</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      )}
    </Paper>
  );
};

export default Dashboard;