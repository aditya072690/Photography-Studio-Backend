# Photography Studio Backend API

Backend API server for the Photography Studio website, built with Express.js and Supabase.

## Features

- RESTful API endpoints for gallery, testimonials, bookings, and contact forms
- Supabase integration for database operations
- CORS enabled for frontend communication
- Rate limiting for API protection
- TypeScript support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your Supabase credentials:
```bash
cp .env.example .env
```

3. Run the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Gallery
- `GET /api/gallery` - Get all gallery items
- `POST /api/gallery` - Create a new gallery item

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `POST /api/testimonials` - Create a new testimonial

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create a new booking

### Contact
- `POST /api/contact` - Submit a contact form

## Environment Variables

See `.env.example` for required environment variables.

## Deployment

This backend is configured for deployment on Railway. See the main README for deployment instructions.

