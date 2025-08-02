'use client';
import { useState } from 'react';

export default function ComplaintForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium'
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      category: '',
      priority: 'medium'
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.5rem' }}
        >
          <option value="">Select Category</option>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="cleaning">Cleaning</option>
          <option value="maintenance">Maintenance</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.5rem' }}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the issue"
          required
          rows="4"
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <button type="submit">Submit Complaint</button>
      {success && <p style={{ color: 'green' }}>Complaint submitted successfully!</p>}
    </form>
  );
}
