'use client';
import { useEffect, useState } from 'react';
import ComplaintForm from '@/components/ComplaintForm';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchComplaints = async () => {
    setRefreshing(true);
    const res = await fetch('/api/complaints', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    if (res.ok) {
      const data = await res.json();
      setComplaints(data);
    } else {
      alert('Unauthorized');
    }
    setLoading(false);
    setRefreshing(false);
  };

  const handleNewComplaint = async (complaint) => {
    const res = await fetch('/api/complaints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(complaint),
    });

    if (res.ok) {
      const newComplaint = await res.json();
      setComplaints([newComplaint, ...complaints]);
    } else {
      alert('Submission failed');
    }
  };

  // Auto-refresh complaints every 30 seconds to see admin updates
  useEffect(() => {
    fetchComplaints();
    
    // Set up auto-refresh
    const interval = setInterval(fetchComplaints, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'in-progress': return '#17a2b8';
      case 'completed': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '⏳ Pending';
      case 'in-progress': return '🔄 In Progress';
      case 'completed': return '✅ Completed';
      default: return status;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '2rem'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: '2rem'
      }}>
        <h2 style={{ color: '#333', marginBottom: '1.5rem' }}>Submit a Complaint</h2>
        <ComplaintForm onSubmit={handleNewComplaint} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ color: '#333' }}>Your Complaints</h3>
          <button 
            onClick={fetchComplaints}
            disabled={refreshing}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: refreshing ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {complaints.length === 0 ? (
              <p>No complaints yet.</p>
            ) : (
              complaints.map((complaint) => (
                <div key={complaint._id} style={{ 
                  border: '1px solid #ddd', 
                  padding: '1.5rem', 
                  marginBottom: '1rem', 
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, color: '#333' }}>{complaint.title}</h4>
                    <span style={{
                      backgroundColor: getStatusColor(complaint.status),
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {getStatusText(complaint.status)}
                    </span>
                  </div>
                  
                  <p><strong>Category:</strong> {complaint.category}</p>
                  <p><strong>Description:</strong> {complaint.description}</p>
                  <p><strong>Priority:</strong> {complaint.priority}</p>
                  
                  {complaint.adminNotes && (
                    <div style={{ 
                      marginTop: '1rem', 
                      padding: '1rem', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '4px',
                      borderLeft: '4px solid #007bff'
                    }}>
                      <strong>📝 Admin Response:</strong>
                      <p style={{ margin: '0.5rem 0 0 0' }}>{complaint.adminNotes}</p>
                    </div>
                  )}
                  
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#666', 
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #eee'
                  }}>
                    <strong>Created:</strong> {new Date(complaint.createdAt).toLocaleDateString()}
                    {complaint.updatedAt !== complaint.createdAt && (
                      <span style={{ marginLeft: '1rem' }}>
                        <strong>Updated:</strong> {new Date(complaint.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: '#e7f3ff', 
          borderRadius: '4px',
          fontSize: '0.9rem',
          color: '#0056b3'
        }}>
          <strong>💡 Tip:</strong> Your complaints will automatically update when an admin changes their status. 
          The page refreshes every 30 seconds, or you can click the refresh button above to check for updates immediately.
        </div>
      </div>
    </div>
  );
}
