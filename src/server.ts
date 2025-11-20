import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy - Required for Railway and other hosting platforms
// This allows Express to correctly identify the client IP when behind a proxy
app.set('trust proxy', true);

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Warning: Supabase credentials not found. Some features may not work.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
// CORS configuration - allows requests from frontend
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      // For development, allow localhost
      if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes

// Gallery endpoints
app.get('/api/gallery', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/gallery', async (req: Request, res: Response) => {
  try {
    const { image_url, title, category, description } = req.body;
    
    const { data, error } = await supabase
      .from('gallery')
      .insert([{ image_url, title, category, description }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/gallery/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { image_url, title, category, description } = req.body;
    
    const { data, error } = await supabase
      .from('gallery')
      .update({ image_url, title, category, description })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/gallery/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Testimonials endpoints
app.get('/api/testimonials', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/testimonials', async (req: Request, res: Response) => {
  try {
    const { name, email, rating, comment, image_url } = req.body;
    
    const { data, error } = await supabase
      .from('testimonials')
      .insert([{ name, email, rating, comment, image_url }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/testimonials/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, rating, comment, image_url } = req.body;
    
    const { data, error } = await supabase
      .from('testimonials')
      .update({ name, email, rating, comment, image_url })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/testimonials/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Bookings endpoints
app.get('/api/bookings', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bookings', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, service_type, date, time, message } = req.body;
    
    const { data, error } = await supabase
      .from('bookings')
      .insert([{ name, email, phone, service_type, date, time, message }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([{ name, email, subject, message }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});

