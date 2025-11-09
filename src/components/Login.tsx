import { useState } from 'react';
import { type LoginRequest } from '../types/auth.types';
import { loginApi } from '../services/apiService';

import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Stack, 
  Title,
  Alert,
  Paper
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
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
      const response = await loginApi(formData);
      onLoginSuccess(response.data.token);
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please check your username and password.');
      setLoading(false);
    }
  };

  return (
    <Paper withBorder shadow="md" p="lg" radius="md"> 
    
      <Title order={2} ta="center">Login</Title>
      
      <form onSubmit={handleSubmit}>
        <Stack gap="md" mt="md"> 
        
          {error && (
            <Alert 
              color="red" 
              title="Error" 
              icon={<IconAlertCircle />}
            >
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
          
          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <Button type="submit" loading={loading} fullWidth>
            Login
          </Button>
          
        </Stack>
      </form>
    </Paper>
  );
};

export default Login;