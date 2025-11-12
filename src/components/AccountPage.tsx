import { useState, useEffect } from 'react';
import { 
  getUserDetailsApi, 
  updateUserApi, 
  changePasswordApi 
} from '../services/apiService';
import { 
  type UpdateUserRequest, 
  type ChangePasswordRequest 
} from '../types/user.types';
import { 
  Paper, 
  Title, 
  Button, 
  Stack, 
  TextInput, 
  PasswordInput,
  Alert,
  Loader,
  Center
} from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';

interface AccountPageProps {
  token: string;
  onBack: () => void;
}

const AccountPage = ({ token, onBack }: AccountPageProps) => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<UpdateUserRequest>({ 
    username: '', 
    email: '' 
  });
  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({ 
    oldPassword: '', 
    newPassword: '' 
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserDetailsApi(token);
        setProfileData({
          username: response.data.username,
          email: response.data.email,
        });
      } catch (err) {
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setError(null);
    setSuccess(null);
    try {
      await updateUserApi(profileData, token);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    setError(null);
    setSuccess(null);
    try {
      await changePasswordApi(passwordData, token);
      setSuccess('Password changed successfully!');
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setError('Failed to change password. Check your old password.');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <Center><Loader /></Center>;
  }

  return (
    <Paper withBorder shadow="md" p="lg" radius="md">
      <Button variant="outline" onClick={onBack} mb="md">
        &larr; Back to Dashboard
      </Button>

      <Title order={2} mb="lg">My Account</Title>

      {error && <Alert color="red" title="Error" icon={<IconAlertCircle />} mb="md">{error}</Alert>}
      {success && <Alert color="green" title="Success" icon={<IconCheck />} mb="md">{success}</Alert>}

      <form onSubmit={handleProfileSubmit}>
        <Stack>
          <Title order={4}>Update Profile</Title>
          <TextInput
            label="Username"
            name="username"
            value={profileData.username}
            onChange={handleProfileChange}
            required
          />
          <TextInput
            label="Email"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleProfileChange}
            required
          />
          <Button type="submit" loading={savingProfile} style={{ alignSelf: 'flex-start' }}>
            Save Profile
          </Button>
        </Stack>
      </form>

      <hr style={{ margin: '20px 0' }} />

      <form onSubmit={handlePasswordSubmit}>
        <Stack>
          <Title order={4}>Change Password</Title>
          <PasswordInput
            label="Old Password"
            name="oldPassword"
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
            required
          />
          <PasswordInput
            label="New Password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            required
          />
          <Button type="submit" loading={savingPassword} style={{ alignSelf: 'flex-start' }}>
            Change Password
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default AccountPage;