import { useState } from 'react';
import { type CreateTargetRequest } from '../types/target.types';
import { createTargetApi } from '../services/apiService';

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

    const dataToSubmit = {
      ...formData,
      checkInterval: Number(formData.checkInterval),
    };

    try {
      await createTargetApi(dataToSubmit, token);
      alert('Target created successfully!');
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
    }
  };

  return (
    <div>
      <h3>Create New Target</h3>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="url">URL:</label>
          <input
            type="text"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="http://example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="checkInterval">Check Interval (minutes):</label>
          <input
            type="number"
            id="checkInterval"
            name="checkInterval"
            value={formData.checkInterval}
            onChange={handleChange}
            min="1"
            max="1440"
            required
          />
        </div>
        <button type="submit">Add Target</button>
      </form>
    </div>
  );
};

export default CreateTarget;