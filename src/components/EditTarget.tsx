import { useState, useEffect } from 'react';
import { type UpdateTargetRequest } from '../types/target.types';
import { getSingleTargetApi, updateTargetApi } from '../services/apiService';

import { 
  TextInput, 
  NumberInput, 
  Button, 
  Stack, 
  Title, 
  Alert, 
  Paper, 
  Group, 
  Center,
  Loader
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface EditTargetProps {
  token: string;
  targetId: number;
  onUpdateComplete: () => void;
}

const EditTarget = ({ token, targetId, onUpdateComplete }: EditTargetProps) => {
  const [formData, setFormData] = useState<UpdateTargetRequest>({
    name: '',
    url: '',
    checkInterval: 5,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTargetData = async () => {
      try {
        const response = await getSingleTargetApi(targetId, token);
        setFormData({
          name: response.data.name,
          url: response.data.url,
          checkInterval: response.data.checkInterval,
        });
        setError(null);
      } catch (err) {
        setError('Failed to load target data.');
      } finally {
        setLoading(false);
      }
    };
    fetchTargetData();
  }, [targetId, token]);

  const handleChange = (name: string, value: string | number) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const dataToSubmit = {
      ...formData,
      checkInterval: Number(formData.checkInterval),
    };

    try {
      await updateTargetApi(targetId, dataToSubmit, token);
      onUpdateComplete();
    } catch (err) {
      setError('Failed to update target.');
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <Paper withBorder shadow="md" p="lg" radius="md">
        <Center>
          <Loader />
          <span style={{ marginLeft: '10px' }}>Loading target data...</span>
        </Center>
      </Paper>
    );
  }

  return (
    <Paper withBorder shadow="md" p="lg" radius="md">
      <Title order={3}>Edit Target (ID: {targetId})</Title>

      <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
        <Stack gap="md">
          {error && (
            <Alert color="red" title="Error" icon={<IconAlertCircle />}>
              {error}
            </Alert>
          )}

          <TextInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.currentTarget.value)}
            required
          />

          <TextInput
            label="URL"
            name="url"
            value={formData.url}
            onChange={(e) => handleChange('url', e.currentTarget.value)}
            required
          />

          <NumberInput
            label="Interval (min)"
            name="checkInterval"
            value={formData.checkInterval}
            onChange={(value) => handleChange('checkInterval', value)}
            min={1}
            max={1440}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onUpdateComplete}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};

export default EditTarget;