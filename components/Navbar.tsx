import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from "next/link";

export default function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '🎯' },
  ];

  return (
    <>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(15, 15, 35, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px'
        }}>
          {/* Logo/Brand */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }} onClick={() => router.push('/')}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
              🎯
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.01em'
            }}>
              Resume Tailor
            </div>
          </div>

          {/* Desktop Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px'
          }}>
            {/* Navigation Links */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px'
            }}>

              {navLinks.map((link, index) => (
                <Link key={index} href={link.href}>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: router.pathname === link.href ? '#8b5cf6' : 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      fontSize: '15px',
                      fontWeight: '500',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      background: router.pathname === link.href ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                      border: router.pathname === link.href ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid transparent',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (router.pathname !== link.href) {
                        (e.target as HTMLSpanElement).style.color = '#ffffff';
                        (e.target as HTMLSpanElement).style.background = 'rgba(255, 255, 255, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (router.pathname !== link.href) {
                        (e.target as HTMLSpanElement).style.color = 'rgba(255, 255, 255, 0.8)';
                        (e.target as HTMLSpanElement).style.background = 'transparent';
                      }
                    }}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </span>
                </Link>
              ))}

            </div>

            {/* User Section */}
            {!loading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                paddingLeft: '24px',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                {user ? (
                  <>
                    {/* User Info */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#ffffff'
                      }}>
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#ffffff',
                          maxWidth: '150px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {user.email}
                        </span>
                        <span style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.5)'
                        }}>
                          Online
                        </span>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      style={{
                        padding: '10px 20px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.background = 'rgba(239, 68, 68, 0.1)';
                        (e.target as HTMLButtonElement).style.borderColor = 'rgba(239, 68, 68, 0.3)';
                        (e.target as HTMLButtonElement).style.color = '#ef4444';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
                        (e.target as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        (e.target as HTMLButtonElement).style.color = '#ffffff';
                      }}
                    >
                      <span>🚪</span>
                      Logout
                    </button>
                  </>
                ) : (
                  /* Login Button */
                  <Link href="/auth/login">
                    <span
                      style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                        color: '#ffffff',
                        textDecoration: 'none',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLSpanElement).style.transform = 'translateY(-1px)';
                        (e.target as HTMLSpanElement).style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLSpanElement).style.transform = 'translateY(0)';
                        (e.target as HTMLSpanElement).style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                      }}
                    >
                      <span>🔑</span>
                      Login
                    </span>
                  </Link>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                display: 'none',
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                color: '#ffffff',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(15, 15, 35, 0.98)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '24px',
            animation: 'slideDown 0.2s ease-out'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              {navLinks.map((link, index) => (
                <Link key={index} href={link.href}>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: router.pathname === link.href ? '#8b5cf6' : 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      fontSize: '16px',
                      fontWeight: '500',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: router.pathname === link.href ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                      border: router.pathname === link.href ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid transparent',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </span>
                </Link>
              ))}

              {!loading && (
                <div style={{
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {user ? (
                    <>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px'
                      }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#ffffff'
                        }}>
                          {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#ffffff'
                          }}>
                            {user.email}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.5)'
                          }}>
                            Online
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        style={{
                          padding: '12px 16px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>🚪</span>
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link href="/auth/login">
                      <span
                        style={{
                          padding: '12px 16px',
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                          color: '#ffffff',
                          textDecoration: 'none',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          textAlign: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>🔑</span>
                        Login
                      </span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
          nav > div > div:nth-child(2) > div:first-child,
          nav > div > div:nth-child(2) > div:nth-child(2) {
            display: none !important;
          }
          
          nav > div > div:nth-child(2) > button {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}