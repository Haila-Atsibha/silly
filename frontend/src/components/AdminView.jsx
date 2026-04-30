import React, { useEffect, useState } from 'react';

const AdminView = () => {
  const [groupedResponses, setGroupedResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://silly-1-6zfv.onrender.com';
        const res = await fetch(`${apiUrl}/api/admin/responses`);
        const data = await res.json();
        
        // Sort data chronologically to build sessions based on time proximity
        const sortedData = [...data].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        const sessions = [];
        let currentSession = null;
        
        sortedData.forEach(curr => {
          const currTime = new Date(curr.timestamp).getTime();
          
          // If no session exists, or this event happened more than 15 minutes after the session STARTED, make a new session
          if (!currentSession || (currTime - new Date(currentSession.timestamp).getTime() > 900000)) {
            currentSession = {
              timestamp: curr.timestamp, // start time of this session
              lastEventTime: curr.timestamp,
              said_yes: null,
              photos: [],
              phones: [], // keep an array of all phone numbers submitted
              social_clicks: [],
              video_progress: null
            };
            sessions.push(currentSession);
          } else {
            // Update the last event time to keep the session alive
            currentSession.lastEventTime = curr.timestamp;
          }
          
          const files = curr.files || [];
          
          if (curr.type === 'said_yes') {
            currentSession.said_yes = files[0] || null;
          } else if (curr.type === 'photos_uploaded') {
            currentSession.photos = [...currentSession.photos, ...files];
          } else if (curr.type === 'phone_submitted') {
            if (files[0] && !currentSession.phones.includes(files[0])) {
              currentSession.phones.push(files[0]);
            }
          } else if (curr.type === 'social_click') {
            if (files[0] && !currentSession.social_clicks.includes(files[0])) {
              currentSession.social_clicks.push(files[0]);
            }
          } else if (curr.type === 'video_progress') {
            const currentProgress = parseFloat(files[0] || '0');
            const existingProgress = parseFloat(currentSession.video_progress || '0');
            currentSession.video_progress = Math.max(existingProgress, currentProgress);
          }
        });
        
        // Show newest sessions at the top
        setGroupedResponses(sessions.reverse());
      } catch (error) {
        console.error('Failed to fetch responses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#fff',
      padding: '2rem',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 100,
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ color: '#d81b60', marginBottom: '2rem', textAlign: 'center' }}>
        Secret Admin Dashboard 🕵️‍♂️
      </h1>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading responses...</p>
      ) : groupedResponses.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No responses yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
          {groupedResponses.map((person, index) => (
            <div key={index} style={{ 
              padding: '1.5rem', 
              borderRadius: '12px', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
              backgroundColor: '#fafafa',
              borderLeft: '5px solid #d81b60'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #ddd', paddingBottom: '0.8rem' }}>
                <h3 style={{ color: '#333', margin: 0 }}>
                  Visitor Session
                </h3>
                <span style={{ color: '#666', fontSize: '0.9rem', fontWeight: '500' }}>
                  {new Date(person.timestamp).toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.05rem' }}>
                {person.said_yes && (
                  <div>
                    <strong>💖 Said YES!</strong> <span style={{ color: '#666' }}>(Chased "No" for {(parseInt(person.said_yes) / 1000).toFixed(1)}s)</span>
                  </div>
                )}
                
                {person.phones && person.phones.length > 0 && (
                  <div>
                    <strong>📱 Phone Number(s):</strong> <span style={{ color: '#2196f3', fontWeight: 'bold' }}>{person.phones.join(', ')}</span>
                  </div>
                )}

                {person.social_clicks.length > 0 && (
                  <div>
                    <strong>🔗 Social Links Clicked:</strong> <span style={{ color: '#ff9800' }}>{person.social_clicks.join(', ')}</span>
                  </div>
                )}

                {person.video_progress > 0 && (
                  <div>
                    <strong>🎵 Video Watched:</strong> <span style={{ color: '#9c27b0' }}>{(person.video_progress / 60).toFixed(2)} minutes</span>
                  </div>
                )}

                {person.photos.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>📸 Uploaded Photos:</strong>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                      {person.photos.map((file, i) => (
                        <a key={i} href={file} target="_blank" rel="noreferrer">
                          <img 
                            src={file} 
                            alt={`Upload ${i}`} 
                            style={{ 
                              width: '120px', 
                              height: '120px', 
                              objectFit: 'cover', 
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'transform 0.2s ease',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }} 
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminView;
