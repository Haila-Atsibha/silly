require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Use memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { files: 3 } });

// POST endpoint to record response
app.post('/api/respond', async (req, res) => {
  const { answer, timeSpent } = req.body;
  
  if (answer !== 'YES') {
    return res.status(400).json({ error: 'Only YES is accepted 😊' });
  }

  const insertData = { type: 'said_yes', ip: req.ip };
  if (timeSpent) {
    insertData.files = [timeSpent.toString()];
  }

  const { data, error } = await supabase
    .from('responses')
    .insert([insertData]);

  if (error) {
    console.error('Error saving response:', error);
    return res.status(500).json({ error: 'Database error' });
  }

  res.status(200).json({ success: true, message: 'Response recorded!' });
});

// POST endpoint to handle photo uploads
app.post('/api/upload-photos', upload.array('photos', 3), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }
    
    const fileUrls = [];
    
    // Upload each file to Supabase storage
    for (const file of req.files) {
      // Clean filename
      const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${Date.now()}-${safeName}`;
      
      const { data, error } = await supabase.storage
        .from('photos')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype
        });
        
      if (error) throw error;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);
        
      fileUrls.push(publicUrlData.publicUrl);
    }
    
    // Save record to database
    const { error: dbError } = await supabase
      .from('responses')
      .insert([{ type: 'photos_uploaded', files: fileUrls, ip: req.ip }]);
      
    if (dbError) throw dbError;

    res.status(200).json({ success: true, message: 'Photos uploaded successfully!', files: fileUrls });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload photos' });
  }
});

// POST endpoint for tracking interactions (social clicks, video progress)
app.post('/api/track', async (req, res) => {
  const { eventType, eventData } = req.body;
  // eventType: 'social_click' | 'video_progress'
  // eventData: 'instagram' or 'telegram' or '120.5' (seconds)
  
  const { error } = await supabase
    .from('responses')
    .insert([{ type: eventType, files: [eventData?.toString()], ip: req.ip }]);

  if (error) {
    console.error('Tracking error:', error);
    return res.status(500).json({ error: 'Tracking failed' });
  }
  
  res.status(200).json({ success: true });
});

// POST endpoint for comments
app.post('/api/comment', async (req, res) => {
  const { comment } = req.body;
  
  const { error } = await supabase
    .from('responses')
    .insert([{ type: 'comment_submitted', files: [comment], ip: req.ip }]);

  if (error) {
    console.error('Comment submission error:', error);
    return res.status(500).json({ error: 'Submission failed' });
  }
  
  res.status(200).json({ success: true });
});

// GET endpoint for admin to view responses
app.get('/api/admin/responses', async (req, res) => {
  const { data, error } = await supabase
    .from('responses')
    .select('*')
    .order('timestamp', { ascending: false });
    
  if (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch' });
  }
  
  res.status(200).json(data);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
