import { useState } from 'react';
import { type CreateTargetRequest } from '../types/target.types';
import { createTargetApi } from '../services/apiService';

import { 
  TextInput, 
  NumberInput,
  Button, 
  Stack, 
  Title, 
  Alert, 
  Group 
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface CreateTargetProps {
  token: string;
  onTargetCreated: () => void;
}

const CreateTarget = ({ token, onTargetCreated }: CreateTargetProps) => {
  const [formData, setFormData] = useState<CreateTargetRequest>({
    name: '',
    url: '',
    checkInterval: 5,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string | number) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const dataToSubmit = {
      ...formData,
      checkInterval: Number(formData.checkInterval), 
    };

    try {
      await createTargetApi(dataToSubmit, token);

      setFormData({ name: '', url: '', checkInterval: 5 });
      onTargetCreated();
    } catch (err: any) {
      console.error('Failed to create target:', err);
      if (err.response && err.response.data && err.response.data.errors) {
        const validationErrors = err.response.data.errors.map((e: any) => e.message).join(', ');
        setError(validationErrors);
      } else {
        setError('Failed to create target. Please check the details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title order={3}>Create New Target</Title>

      <form onSubmit={handleSubmit}>
        <Stack gap="md" mt="sm">
          {error && (
            <Alert color="red" title="Error" icon={<IconAlertCircle />}>
              {error}
            </Alert>
          )}

          <Group grow>
            <TextInput
              label="Name"
              name="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.currentTarget.value)}
              placeholder="My personal blog"
              required
            />

            <TextInput
              label="URL"
              name="url"
              value={formData.url}
              onChange={(e) => handleChange('url', e.currentTarget.value)}
              placeholder="http://example.com"
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
          </Group>

          <Group justify="flex-end" mt="xs">
            <Button type="submit" loading={loading}>
              Add Target
            </Button>
          </Group>

        </Stack>
      </form>
    </div>
  );
};

export default CreateTarget;