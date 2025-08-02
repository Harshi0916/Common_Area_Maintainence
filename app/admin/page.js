'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/complaints', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      } else {
        alert('Unauthorized');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
    setLoading(false);
  };

  const updateStatus = async (complaintId, newStatus) => {
    try {
      const res = await fetch(`/api/complaints/${complaintId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updatedComplaint = await res.json();
        setComplaints(complaints.map(c => 
          c._id === complaintId ? updatedComplaint : c
        ));
      } else {
        alert('Update failed');
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      alert('Update failed');
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', color: '#333' }}>Admin Dashboard</h1>
      
      <h2 style={{ marginBottom: '1rem', color: '#555' }}>All Complaints</h2>
      
      {complaints.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No complaints found.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {complaints.map((complaint) => (
            <div 
              key={complaint._id} 
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1.5rem',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{complaint.title}</h3>
                  <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                    Category: <span style={{ fontWeight: 'bold' }}>{complaint.category}</span>
                  </p>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                    Submitted by: {complaint.createdBy?.username || 'Unknown'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span 
                    style={{
                      backgroundColor: complaint.priority === 'high' ? '#dc3545' : complaint.priority === 'medium' ? '#ffc107' : '#28a745',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {complaint.priority.toUpperCase()}
                  </span>
                  <span 
                    style={{
                      backgroundColor: complaint.status === 'pending' ? '#ffc107' : complaint.status === 'in-progress' ? '#17a2b8' : '#28a745',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {complaint.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <p style={{ margin: '0 0 1rem 0', color: '#555' }}>{complaint.description}</p>
              
              <div style={{ fontSize: '0.8rem', color: '#888' }}>
                Created: {new Date(complaint.createdAt).toLocaleDateString()}
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#555' }}>Update Status</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => updateStatus(complaint._id, 'pending')}
                    disabled={complaint.status === 'pending'}
                    style={{
                      backgroundColor: complaint.status === 'pending' ? '#ccc' : '#ffc107',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: complaint.status === 'pending' ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => updateStatus(complaint._id, 'in-progress')}
                    disabled={complaint.status === 'in-progress'}
                    style={{
                      backgroundColor: complaint.status === 'in-progress' ? '#ccc' : '#17a2b8',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: complaint.status === 'in-progress' ? 'not-allowed' : 'pointer'
                    }}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => updateStatus(complaint._id, 'completed')}
                    disabled={complaint.status === 'completed'}
                    style={{
                      backgroundColor: complaint.status === 'completed' ? '#ccc' : '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: complaint.status === 'completed' ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Completed
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 