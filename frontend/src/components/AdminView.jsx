import React, { useEffect, useState } from 'react';

const AdminView = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://silly-1-6zfv.onrender.com';
        const res = await fetch(`${apiUrl}/api/admin/responses`);
        const data = await res.json();
        setResponses(data);
      } catch (error) {
        console.error('Failed to fetch responses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  const apiUrl = import.meta.env.VITE_API_URL || 'https://silly-1-6zfv.onrender.com';

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#fff',
      padding: '2rem',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 100,
      overflowY: 'auto'
    }}>
      <h1 style={{ color: '#d81b60', marginBottom: '2rem', textAlign: 'center' }}>
        Secret Admin Dashboard 🕵️‍♂️
      </h1>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading responses...</p>
      ) : responses.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No responses yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          {responses.map((resp, index) => (
            <div key={index} style={{ 
              padding: '1.5rem', 
              borderRadius: '12px', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
              backgroundColor: '#fafafa',
              borderLeft: resp.type === 'photos_uploaded' ? '5px solid #4caf50' : '5px solid #ffb6c1'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <strong>
                    {resp.type === 'photos_uploaded' ? '📸 Photos Uploaded' : '💖 Said YES!'}
                  </strong>
                  {resp.type === 'said_yes' && resp.files && resp.files[0] && (
                    <span style={{ marginLeft: '10px', color: '#d81b60', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      (Chased "No" for {(parseInt(resp.files[0]) / 1000).toFixed(1)}s)
                    </span>
                  )}
                </div>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>
                  {new Date(resp.timestamp).toLocaleString()}
                </span>
              </div>

              {resp.type === 'photos_uploaded' && resp.files && (
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  {resp.files.map((file, i) => (
                    <a key={i} href={file} target="_blank" rel="noreferrer">
                      <img 
                        src={file} 
                        alt={`Upload ${i}`} 
                        style={{ 
                          width: '150px', 
                          height: '150px', 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease'
                        }} 
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminView;
