import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Handle login with email+password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Logged in! Redirecting...');
      setTimeout(() => router.push('/dashboard'), 1000);
    }
    setLoading(false);
  };

  // Handle registration with magic link
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the magic link! After verifying, you will be prompted to set a password.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '15%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '15%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
            padding: '12px 24px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '50px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <span style={{ fontSize: '24px' }}>🎯</span>
            <span style={{
              fontSize: '18px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Resume Tailor</span>
          </div>
          
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
            lineHeight: '1.2'
          }}>
            Welcome Back
          </h1>
          
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: 0
          }}>
            {mode === 'login' 
              ? 'Sign in to your account to continue'
              : 'Create your account and get started'
            }
          </p>
        </div>

        {/* Main Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '40px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          {/* Mode Toggle */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '6px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {(['login', 'register'] as const).map((modeOption) => (
              <button
                key={modeOption}
                onClick={() => { setMode(modeOption); setMessage(''); }}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: mode === modeOption 
                    ? 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)' 
                    : 'transparent',
                  color: mode === modeOption ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: mode === modeOption ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (mode !== modeOption) {
                    (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.05)';
                    (e.target as HTMLButtonElement).style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (mode !== modeOption) {
                    (e.target as HTMLButtonElement).style.background = 'transparent';
                    (e.target as HTMLButtonElement).style.color = 'rgba(255, 255, 255, 0.7)';
                  }
                }}
              >
                {modeOption === 'login' ? '🔑 Login' : '✨ Register'}
              </button>
            ))}
          </div>

          {/* Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Email Input */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      paddingLeft: '50px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      color: '#ffffff',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      fontFamily: 'Inter, system-ui, sans-serif'
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLInputElement).style.borderColor = 'rgba(139, 92, 246, 0.5)';
                      (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLInputElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      (e.target as HTMLInputElement).style.boxShadow = 'none';
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '18px'
                  }}>📧</span>
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      paddingLeft: '50px',
                      paddingRight: '50px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      color: '#ffffff',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      fontFamily: 'Inter, system-ui, sans-serif'
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLInputElement).style.borderColor = 'rgba(139, 92, 246, 0.5)';
                      (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLInputElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      (e.target as HTMLInputElement).style.boxShadow = 'none';
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '18px'
                  }}>🔒</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.5)',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading
                    ? 'rgba(156, 163, 175, 0.3)'
                    : 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: loading 
                    ? 'none' 
                    : '0 8px 20px rgba(139, 92, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
                    (e.target as HTMLButtonElement).style.boxShadow = '0 12px 28px rgba(139, 92, 246, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                    (e.target as HTMLButtonElement).style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid #ffffff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    🚀 Sign In
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Email Input */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      paddingLeft: '50px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      color: '#ffffff',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      fontFamily: 'Inter, system-ui, sans-serif'
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLInputElement).style.borderColor = 'rgba(139, 92, 246, 0.5)';
                      (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLInputElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      (e.target as HTMLInputElement).style.boxShadow = 'none';
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '18px'
                  }}>📧</span>
                </div>
              </div>

              {/* Info Box */}
              <div style={{
                padding: '16px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.5'
              }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '16px', marginTop: '2px' }}>💡</span>
                  <div>
                    <strong style={{ color: '#3b82f6' }}>Magic Link Registration</strong>
                    <br />
                    We will send you a secure link to verify your email and set up your account.
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading
                    ? 'rgba(156, 163, 175, 0.3)'
                    : 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: loading 
                    ? 'none' 
                    : '0 8px 20px rgba(139, 92, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
                    (e.target as HTMLButtonElement).style.boxShadow = '0 12px 28px rgba(139, 92, 246, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                    (e.target as HTMLButtonElement).style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid #ffffff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Sending magic link...
                  </>
                ) : (
                  <>
                    ✨ Send Magic Link
                  </>
                )}
              </button>
            </form>
          )}

          {/* Message Display */}
          {message && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '14px',
              lineHeight: '1.5',
              background: message.includes('error') || message.includes('Error')
                ? 'rgba(239, 68, 68, 0.1)'
                : message.includes('Logged in') || message.includes('Check your email')
                ? 'rgba(34, 197, 94, 0.1)'
                : 'rgba(59, 130, 246, 0.1)',
              border: message.includes('error') || message.includes('Error')
                ? '1px solid rgba(239, 68, 68, 0.2)'
                : message.includes('Logged in') || message.includes('Check your email')
                ? '1px solid rgba(34, 197, 94, 0.2)'
                : '1px solid rgba(59, 130, 246, 0.2)',
              color: message.includes('error') || message.includes('Error')
                ? '#ef4444'
                : message.includes('Logged in') || message.includes('Check your email')
                ? '#22c55e'
                : '#3b82f6',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <span style={{ fontSize: '16px', marginTop: '2px' }}>
                {message.includes('error') || message.includes('Error') 
                  ? '❌' 
                  : message.includes('Logged in') || message.includes('Check your email')
                  ? '✅'
                  : 'ℹ️'
                }
              </span>
              <div>{message}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '14px'
        }}>
          <p style={{ margin: 0 }}>
            Secure authentication powered by Supabase
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        ::placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
        }
      `}</style>
    </div>
  );
}