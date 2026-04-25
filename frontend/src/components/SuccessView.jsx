import React, { useState } from 'react';
import Confetti from 'react-confetti';

const SuccessView = () => {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 3);
      setFiles(selectedFiles);
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

  return (
    <>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={true}
        numberOfPieces={200}
      />
      <div className="card" style={{ animation: 'fadeIn 1s ease-in-out' }}>
        <h1 className="heading" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Congratulations! 🎉
        </h1>
        <p className="success-message">
          You just got yourself a great guy ❤️
        </p>

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
      </div>
    </>
  );
};

export default SuccessView;
