import { useState } from 'react';
import { type RegisterRequest } from '../types/auth.types';
import { registerApi } from '../services/apiService';

import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Stack, 
  Title,
  Alert,
  Paper,
  Container,
  Anchor
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface RegisterProps {
  onRegisterSuccess: (token: string) => void;
  onShowLogin: () => void;
}

const Register = ({ onRegisterSuccess, onShowLogin }: RegisterProps) => {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    password: '',
    email: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await registerApi(formData);
      onRegisterSuccess(response.data.token);
    } catch (err: any) {
      console.error('Registration failed:', err);
      if (err.response && err.response.data && err.response.data.errors) {
        const validationErrors = err.response.data.errors.map((e: any) => e.message).join(', ');
        setError(validationErrors);
      } else {
        setError('Registration failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <Container size="xs" style={{ width: '100%' }}>
      <Paper withBorder shadow="md" p="lg" radius="md"> 
        <Title order={2} ta="center">Create Account</Title>

        <form onSubmit={handleSubmit}>
          <Stack gap="md" mt="md"> 

            {error && (
              <Alert color="red" title="Error" icon={<IconAlertCircle />}>
                {error}
              </Alert>
            )}

            <TextInput
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <TextInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your-email@example.com"
              required
            />

            <PasswordInput
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button type="submit" loading={loading} fullWidth>
              Register
            </Button>

            <Anchor component="button" type="button" c="dimmed" onClick={onShowLogin} size="sm" ta="center">
              Already have an account? Login
            </Anchor>

          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;