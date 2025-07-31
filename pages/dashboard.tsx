import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../lib/supabaseClient';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailoredResume, setTailoredResume] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume || !jobDescription) {
      alert('Please upload a resume and paste the job description.');
      return;
    }
    setIsTailoring(true);
    setTailoredResume('');

    try {
      // First, extract text from the uploaded file
      const formData = new FormData();
      formData.append('file', resume);

      // Get Supabase access token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const fileResponse = await fetch('/api/process-file', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });

      const fileData = await fileResponse.json();
      if (!fileResponse.ok) {
        throw new Error(fileData.error || 'Failed to process file');
      }

      const resumeText = fileData.text;

      // Now send the extracted text to AI for tailoring
      const response = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resumeText, jobDescription }),
      });

      const data = await response.json();
      if (response.ok) {
        setTailoredResume(data.tailored);
      } else {
        alert(data.error || 'Failed to tailor resume.');
      }
    } catch (error) {
      console.error('Error tailoring resume:', error);
      alert('An unexpected error occurred.');
    } finally {
      setIsTailoring(false);
    }
  };

  if (loading || !user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '18px',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '24px 32px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid rgba(139, 92, 246, 0.3)',
            borderTop: '2px solid #8b5cf6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '15%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>

      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
          padding: '32px 0'
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
            }}>AI Resume Tailor</span>
          </div>
          
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
            lineHeight: '1.2',
            letterSpacing: '-0.02em'
          }}>
            Transform Your Resume
          </h1>
          
          <p style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            AI-powered optimization that matches your resume to any job description
          </p>
        </div>

        {/* Main Form Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '48px',
          marginBottom: tailoredResume ? '32px' : '0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* File Upload Section */}
            <div>
              <label htmlFor="resume-upload" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
                fontSize: '18px',
                fontWeight: '600',
                color: '#ffffff'
              }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}>📄</span>
                Upload Resume
              </label>
              
              <div style={{
                position: 'relative',
                border: '2px dashed rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                background: resume ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                borderColor: resume ? 'rgba(34, 197, 94, 0.5)' : 'rgba(255, 255, 255, 0.2)'
              }}>
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                
                {resume ? (
                  <div style={{ color: '#22c55e' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                    <div style={{ fontSize: '16px', fontWeight: '500' }}>{resume.name}</div>
                    <div style={{ fontSize: '14px', opacity: 0.7, marginTop: '4px' }}>Ready to process</div>
                  </div>
                ) : (
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
                    <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>Drop your resume here</div>
                    <div style={{ fontSize: '14px', opacity: 0.7 }}>Supports PDF, DOC, DOCX</div>
                  </div>
                )}
              </div>
            </div>

            {/* Job Description Section */}
            <div>
              <label htmlFor="job-description" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
                fontSize: '18px',
                fontWeight: '600',
                color: '#ffffff'
              }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}>💼</span>
                Job Description
              </label>
              
              <div style={{ position: 'relative' }}>
                <textarea
                  id="job-description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                  placeholder="Paste the complete job description here...

Include all relevant details:
• Required skills and qualifications
• Job responsibilities and duties  
• Company information
• Preferred experience"
                  style={{
                    width: '100%',
                    minHeight: '200px',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    fontSize: '16px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    lineHeight: '1.6',
                    color: '#ffffff',
                    resize: 'vertical',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(139, 92, 246, 0.5)';
                    (e.target as HTMLTextAreaElement).style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    (e.target as HTMLTextAreaElement).style.boxShadow = 'none';
                  }}
                />
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>
                  <span>{jobDescription.length} characters</span>
                  <span>{jobDescription.split(' ').filter(word => word.length > 0).length} words</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isTailoring}
              style={{
                padding: '20px 32px',
                fontSize: '18px',
                fontWeight: '600',
                background: isTailoring
                  ? 'rgba(156, 163, 175, 0.3)'
                  : 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                cursor: isTailoring ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                transform: isTailoring ? 'scale(0.98)' : 'scale(1)',
                boxShadow: isTailoring 
                  ? 'none' 
                  : '0 10px 25px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!isTailoring) {
                  (e.target as HTMLButtonElement).style.transform = 'scale(1.02)';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 15px 35px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isTailoring) {
                  (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 10px 25px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)';
                }
              }}
            >
              {isTailoring ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid #ffffff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  AI is crafting your perfect resume...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  ✨ Transform My Resume
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {tailoredResume && (
          <div style={{ animation: 'slideUp 0.5s ease-out' }}>
            {/* Success Header */}
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '20px',
              padding: '32px',
              textAlign: 'center',
              marginBottom: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
              <h2 style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '8px'
              }}>
                Your Resume is Ready!
              </h2>
              <p style={{
                margin: 0,
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                AI-optimized and perfectly tailored for maximum impact
              </p>
            </div>

            {/* Content Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              {/* Action Bar */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px'
              }}>
                <h3 style={{
                  margin: 0,
                  color: '#ffffff',
                  fontSize: '20px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>📄</span>
                  Tailored Resume Content
                </h3>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {[
                    { label: '📋 Copy', color: '#8b5cf6', action: () => navigator.clipboard.writeText(tailoredResume.replace(/<[^>]*>/g, '')) },
                    { label: '💾 HTML', color: '#059669', action: () => {
                      const element = document.createElement('a');
                      const htmlContent = `<!DOCTYPE html><html><head><title>Tailored Resume</title><style>body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; } h1, h2, h3 { color: #2c3e50; } .header { border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-bottom: 20px; }</style></head><body><div class="header"><h1>Tailored Resume</h1><p>Generated on ${new Date().toLocaleDateString()}</p></div>${tailoredResume}</body></html>`;
                      const file = new Blob([htmlContent], { type: 'text/html' });
                      element.href = URL.createObjectURL(file);
                      element.download = 'tailored-resume.html';
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }},
                    { label: '📄 Word', color: '#dc2626', action: () => {
                      const wordContent = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Tailored Resume</title><!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>90</w:Zoom><w:DoNotPromptForConvert/><w:DoNotShowInsertionsAndDeletions/></w:WordDocument></xml><![endif]--><style>body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; } h1, h2, h3 { color: #2c3e50; }</style></head><body><h1>Tailored Resume</h1><p>Generated on ${new Date().toLocaleDateString()}</p><hr>${tailoredResume}</body></html>`;
                      const element = document.createElement('a');
                      const file = new Blob([wordContent], { type: 'application/msword' });
                      element.href = URL.createObjectURL(file);
                      element.download = 'tailored-resume.doc';
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }},
                    { label: '🖨️ Print', color: '#7c3aed', action: () => {
                      const printWindow = window.open('', '_blank');
                      printWindow?.document.write(`<html><head><title>Tailored Resume</title></head><body style="font-family: Arial, sans-serif; padding: 20px;">${tailoredResume}</body></html>`);
                      printWindow?.document.close();
                      printWindow?.print();
                    }}
                  ].map((btn, index) => (
                    <button
                      key={index}
                      onClick={btn.action}
                      style={{
                        padding: '12px 20px',
                        background: btn.color,
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                        (e.target as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                        (e.target as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resume Content */}
              <div
                dangerouslySetInnerHTML={{ __html: tailoredResume }}
                style={{
                  padding: '32px',
                  lineHeight: '1.8',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '16px',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }}
              />
            </div>

            {/* Next Steps */}
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '20px',
              padding: '32px',
              marginTop: '24px',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <h4 style={{
                margin: '0 0 20px 0',
                color: '#3b82f6',
                fontSize: '20px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span>💡</span>
                Next Steps
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                {[
                  '✨ Review the tailored content for accuracy',
                  '🎯 Make any personal adjustments needed',
                  '💾 Save or print your optimized resume',
                  '🚀 Apply with confidence to your target job!'
                ].map((step, index) => (
                  <div key={index} style={{
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    fontSize: '15px',
                    lineHeight: '1.5'
                  }}>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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
        
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        ::placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  );
}