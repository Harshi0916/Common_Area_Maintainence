'use client';
import { useEffect, useState } from 'react';
import ComplaintForm from '@/components/ComplaintForm';
import axios from 'axios';

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);

  const loadComplaints = async () => {
    const res = await axios.get('/api/complaints');
    setComplaints(res.data);
  };

  const handleComplaintSubmit = async (data) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/complaints', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      loadComplaints(); // refresh list
    } catch (err) {
      console.error('Error submitting complaint', err);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <ComplaintForm onSubmit={handleComplaintSubmit} />
      <ul>
        {complaints.map((c) => (
          <li key={c._id}>
            <strong>{c.description}</strong> — {c.status} (by {c.createdBy?.name || 'User'})
          </li>
        ))}
      </ul>
    </div>
  );
}
