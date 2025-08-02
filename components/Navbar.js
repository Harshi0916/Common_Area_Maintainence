'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Check login status on mount and when localStorage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (token) {
        setIsLoggedIn(true);
        setUserRole(role);
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };

    // Check immediately
    checkLoginStatus();

    // Listen for storage changes (when login/logout happens)
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically to catch login state changes
    const interval = setInterval(checkLoginStatus, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setIsLoggedIn(false);
      setUserRole(null);
      router.push('/');
    }
  };

  return (
    <nav style={{
      backgroundColor: '#2c3e50',
      padding: '1rem 2rem',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      borderBottom: '1px solid #1a252f'
    }}>
      <div>
        <Link href="/" style={{ 
          color: 'white', 
          textDecoration: 'none', 
          fontWeight: 'bold',
          fontSize: '1.4rem'
        }}>
          Common Area Maintenance
        </Link>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {isLoggedIn ? (
          <>
            {userRole === 'admin' ? (
              <Link href="/admin" style={{ 
                color: 'white', 
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                backgroundColor: '#e74c3c',
                fontSize: '0.9rem'
              }}>
                Admin Dashboard
              </Link>
            ) : (
              <Link href="/complaints" style={{ 
                color: 'white', 
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                backgroundColor: '#3498db',
                fontSize: '0.9rem'
              }}>
                My Complaints
              </Link>
            )}
            
            <span style={{ 
              fontSize: '0.8rem', 
              color: '#ecf0f1',
              padding: '0.3rem 0.6rem',
              backgroundColor: '#34495e',
              borderRadius: '3px',
              border: '1px solid #4a5f6a'
            }}>
              {userRole === 'admin' ? 'Admin' : 'User'}
            </span>
            
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: '#3498db',
              fontSize: '0.9rem'
            }}>
              Login
            </Link>
            
            <Link href="/signup" style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: '#27ae60',
              fontSize: '0.9rem'
            }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
