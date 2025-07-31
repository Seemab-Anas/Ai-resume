import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../components/AuthProvider';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (window.location.hash.includes('access_token')) {
      setIsLoggingIn(true);
    } else if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f9f9f9' }}>
      <h1 style={{ fontSize: 36, marginBottom: 16 }}>Welcome to Resume Tailor</h1>
      <p style={{ fontSize: 18, marginBottom: 32, maxWidth: 500, textAlign: 'center' }}>
        Instantly tailor your resume for any job using AI. Sign in to get started!
      </p>
      {isLoggingIn ? (
        <p>Logging in...</p>
      ) : (
        <Link href="/auth/login">
          <button style={{ padding: '12px 32px', fontSize: 18, borderRadius: 6, background: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Get Started
          </button>
        </Link>
      )}
    </div>
  );
} 