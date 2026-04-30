import React, { useState, useRef, useEffect } from 'react';
import Confetti from 'react-confetti';

const SuccessView = () => {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneStatus, setPhoneStatus] = useState('');
  const maxVideoTime = useRef(0);
  const videoRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 3);
      setFiles(selectedFiles);
    }
  };

  const trackEvent = async (eventType, eventData) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://silly-1-6zfv.onrender.com';
      await fetch(`${apiUrl}/api/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, eventData }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSocialClick = (platform) => {
    trackEvent('social_click', platform);
  };

  const handlePhoneSubmit = async () => {
    if (!phone) return;
    setPhoneStatus('submitting');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://silly-1-6zfv.onrender.com';
      const response = await fetch(`${apiUrl}/api/phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (response.ok) setPhoneStatus('success');
      else setPhoneStatus('error');
    } catch (e) {
      console.error(e);
      setPhoneStatus('error');
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploadStatus('uploading');
    const formData = new FormData();
    files.forEach(file => {
      formData.append('photos', file);
    });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://silly-1-6zfv.onrender.com';
      const response = await fetch(`${apiUrl}/api/upload-photos`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('success');
      } else {
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
    }
  };

  // Track max video time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const curr = videoRef.current.currentTime;
      if (curr > maxVideoTime.current) {
        maxVideoTime.current = curr;
      }
    }
  };

  useEffect(() => {
    // on unmount, send the max time played
    return () => {
      if (maxVideoTime.current > 0) {
        trackEvent('video_progress', maxVideoTime.current);
      }
    };
  }, []);

  return (
    <>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={true}
        numberOfPieces={200}
      />
      <div className="card" style={{ animation: 'fadeIn 1s ease-in-out', maxHeight: '90vh', overflowY: 'auto' }}>
        <h1 className="heading" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Congratulations! 🎉
        </h1>
        <p className="success-message">
          You just got yourself a great guy ❤️
        </p>

        {/* Video Section */}
        <div style={{ marginTop: '2rem' }}>
          <p style={{ fontWeight: 'bold', color: '#d81b60', marginBottom: '10px' }}>This song is for you, tap on it 🎵</p>
          <video 
            ref={videoRef}
            src="/video_2026-04-30_17-03-14.mp4" 
            controls 
            onTimeUpdate={handleTimeUpdate}
            onPause={() => trackEvent('video_progress', maxVideoTime.current)}
            style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
          />
        </div>

        {/* Upload Section */}
        <div className="upload-section" style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
          <p style={{ fontWeight: '600', marginBottom: '1rem', color: '#d81b60' }}>
            If you smiled, upload up to 3 photos of yourself! 😊
          </p>
          
          {uploadStatus === 'success' ? (
            <p style={{ color: '#4caf50', fontWeight: 'bold' }}>Photos uploaded! Thank you ❤️</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleFileChange}
                style={{ fontSize: '0.9rem' }}
              />
              <p style={{ fontSize: '0.8rem', color: '#666' }}>
                {files.length} of 3 selected
              </p>
              
              <button 
                onClick={handleUpload}
                disabled={files.length === 0 || uploadStatus === 'uploading'}
                style={{
                  backgroundColor: files.length > 0 ? '#ffb6c1' : '#ccc',
                  color: files.length > 0 ? '#333' : '#666',
                  padding: '0.5rem 1.5rem',
                  fontSize: '1rem'
                }}
              >
                {uploadStatus === 'uploading' ? 'Uploading...' : 'Send Photos'}
              </button>
              
              {uploadStatus === 'error' && (
                <p style={{ color: '#f44336', fontSize: '0.9rem' }}>Upload failed, please try again.</p>
              )}
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div style={{ marginTop: '1rem', padding: '1rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
          <p style={{ fontWeight: '600', marginBottom: '1rem', color: '#d81b60' }}>
            Contact me here:
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
            <a href="https://instagram.com/haileiyesus133" target="_blank" rel="noreferrer" onClick={() => handleSocialClick('instagram')} style={{ textDecoration: 'none', color: '#E1306C', fontWeight: 'bold' }}>
              📸 Instagram
            </a>
            <a href="https://t.me/HMA133" target="_blank" rel="noreferrer" onClick={() => handleSocialClick('telegram')} style={{ textDecoration: 'none', color: '#0088cc', fontWeight: 'bold' }}>
              ✈️ Telegram
            </a>
          </div>
          
          <p style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Or leave your number:</p>
          {phoneStatus === 'success' ? (
            <p style={{ color: '#4caf50', fontWeight: 'bold' }}>Number saved! 📞</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <input 
                  type="tel" 
                  placeholder="Phone number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                />
                <button 
                  onClick={handlePhoneSubmit}
                  disabled={!phone || phoneStatus === 'submitting'}
                  style={{
                    backgroundColor: phone ? '#4caf50' : '#ccc',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem'
                  }}
                >
                  {phoneStatus === 'submitting' ? '...' : 'Send'}
                </button>
              </div>
              
              {phoneStatus === 'error' && (
                <p style={{ color: '#f44336', fontSize: '0.9rem' }}>Submission failed, please try again.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SuccessView;
