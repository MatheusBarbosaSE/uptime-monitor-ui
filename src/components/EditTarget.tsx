import { useState, useEffect } from 'react';
import { type UpdateTargetRequest } from '../types/target.types';
import { getSingleTargetApi, updateTargetApi } from '../services/apiService';

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
        setLoading(false);
      } catch (err) {
        setError('Failed to load target data.');
      }
    };
    fetchTargetData();
  }, [targetId, token]);

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
      await updateTargetApi(targetId, dataToSubmit, token);
      alert('Target updated successfully!');
      onUpdateComplete();
    } catch (err) {
      setError('Failed to update target.');
    }
  };

  if (loading) {
    return <p>Loading target data to edit...</p>;
  }

  return (
    <div>
      <h3>Edit Target (ID: {targetId})</h3>
      <button onClick={onUpdateComplete}>&larr; Cancel</button>

      <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
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
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditTarget;