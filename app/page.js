import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f0f8ff',
      padding: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        maxWidth: '600px', 
        textAlign: 'center',
        color: '#2c3e50'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '1rem',
          fontWeight: 'bold',
          color: '#1a1a1a'
        }}>
          Common Area Maintenance
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          marginBottom: '3rem',
          color: '#5a6c7d'
        }}>
          Submit and track maintenance complaints for your common areas
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          justifyContent: 'center', 
          flexWrap: 'wrap'
        }}>
          <Link href="/login" style={{
            padding: '1rem 2rem',
            backgroundColor: '#3498db',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease'
          }}>
            Login
          </Link>
          
          <Link href="/signup" style={{
            padding: '1rem 2rem',
            backgroundColor: '#27ae60',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease'
          }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
