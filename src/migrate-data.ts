import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in .env file');
  console.error('Please make sure you have SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set in backend/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Gallery data - extracted from frontend/data/gallery.ts
const galleryData = [
  { id: 'w1', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', title: 'Elegant Wedding Ceremony', category: 'Wedding', alt: 'Wedding ceremony photo' },
  { id: 'w2', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800', title: 'Wedding Reception', category: 'Wedding', alt: 'Wedding reception photo' },
  { id: 'w3', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', title: 'Bridal Portraits', category: 'Wedding', alt: 'Bridal portrait' },
  { id: 'e1', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', title: 'Corporate Event', category: 'Events', alt: 'Corporate event photography' },
  { id: 'e2', image: 'https://images.unsplash.com/photo-1478146897152-7e675f0a3e0a?w=800', title: 'Birthday Celebration', category: 'Events', alt: 'Birthday party photography' },
  { id: 'e3', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800', title: 'Anniversary Party', category: 'Events', alt: 'Anniversary celebration' },
  { id: 'p1', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', title: 'Family Portrait', category: 'Portraits', alt: 'Family portrait session' },
  { id: 'p2', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', title: 'Professional Headshot', category: 'Portraits', alt: 'Corporate headshot' },
  { id: 'p3', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800', title: 'Individual Portrait', category: 'Portraits', alt: 'Individual portrait' },
  { id: 's1', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800', title: 'Fashion Studio', category: 'Studio Shoots', alt: 'Fashion photography' },
  { id: 's2', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', title: 'Beauty Portrait', category: 'Studio Shoots', alt: 'Beauty photography' },
  { id: 'pr1', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', title: 'Product Showcase', category: 'Products', alt: 'Product photography' },
  { id: 'pr2', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', title: 'E-commerce Product', category: 'Products', alt: 'Product photography' },
  { id: 'b1', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800', title: 'Newborn Session', category: 'Baby Shoots', alt: 'Newborn photography' },
  { id: 'b2', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800', title: 'Baby Portrait', category: 'Baby Shoots', alt: 'Baby photography' },
];

// Testimonials data - extracted from frontend/data/testimonials.ts
const testimonialsData = [
  { id: '1', clientName: 'Sarah & Michael Johnson', clientImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', service: 'Wedding Photography', rating: 5, review: 'Absolutely incredible! They captured every moment of our special day perfectly. The photos are stunning and we couldn\'t be happier. Highly recommend!', date: '2024-01-15', featured: true },
  { id: '2', clientName: 'David Chen', clientImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', service: 'Corporate Headshots', rating: 5, review: 'Professional, efficient, and the results exceeded expectations. The team made me feel comfortable and the final photos are perfect for my professional profile.', date: '2024-02-20', featured: true },
  { id: '3', clientName: 'Emily Rodriguez', service: 'Family Portraits', rating: 5, review: 'Our family photos turned out beautifully! The photographer was patient with our kids and captured genuine moments. We\'ll treasure these forever.', date: '2024-03-10', featured: true },
  { id: '4', clientName: 'James Wilson', service: 'Event Photography', rating: 5, review: 'They photographed our company\'s annual event and did an amazing job. Great attention to detail and captured all the important moments.', date: '2024-01-28', featured: false },
  { id: '5', clientName: 'Lisa Thompson', clientImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', service: 'Baby Photography', rating: 5, review: 'The newborn session was handled with such care and professionalism. The photos of our baby are absolutely precious. Thank you!', date: '2024-02-14', featured: true },
  { id: '6', clientName: 'Robert Martinez', service: 'Product Photography', rating: 5, review: 'Excellent product photography for our e-commerce store. The images are high quality and really showcase our products well. Great service!', date: '2024-03-05', featured: false },
];

// Migrate gallery data
async function migrateGallery() {
  console.log('📸 Migrating gallery data...');
  
  if (galleryData.length === 0) {
    console.log('⚠️  No gallery items found to migrate');
    return;
  }
  
  console.log(`Found ${galleryData.length} gallery items`);
  
  // Check if data already exists
  const { data: existingData } = await supabase
    .from('gallery')
    .select('id')
    .limit(1);
  
  if (existingData && existingData.length > 0) {
    console.log('⚠️  Gallery table already has data. Skipping migration.');
    console.log('   To re-migrate, clear the gallery table first in Supabase dashboard.');
    return;
  }
  
  // Transform and insert into Supabase
  const insertData = galleryData.map(item => ({
    image_url: item.image,
    title: item.title,
    category: item.category,
    description: item.alt || ''
  }));
  
  const { data, error } = await supabase
    .from('gallery')
    .insert(insertData)
    .select();
  
  if (error) {
    console.error('❌ Error migrating gallery:', error.message);
    return;
  }
  
  console.log(`✅ Successfully migrated ${data?.length || 0} gallery items`);
}

// Migrate testimonials data
async function migrateTestimonials() {
  console.log('💬 Migrating testimonials data...');
  
  if (testimonialsData.length === 0) {
    console.log('⚠️  No testimonials found to migrate');
    return;
  }
  
  console.log(`Found ${testimonialsData.length} testimonials`);
  
  // Check if data already exists
  const { data: existingData } = await supabase
    .from('testimonials')
    .select('id')
    .limit(1);
  
  if (existingData && existingData.length > 0) {
    console.log('⚠️  Testimonials table already has data. Skipping migration.');
    console.log('   To re-migrate, clear the testimonials table first in Supabase dashboard.');
    return;
  }
  
  // Transform and insert into Supabase
  const insertData = testimonialsData.map(item => ({
    name: item.clientName,
    email: null, // Not available in source data
    rating: item.rating,
    comment: item.review,
    image_url: item.clientImage || null
  }));
  
  const { data, error } = await supabase
    .from('testimonials')
    .insert(insertData)
    .select();
  
  if (error) {
    console.error('❌ Error migrating testimonials:', error.message);
    return;
  }
  
  console.log(`✅ Successfully migrated ${data?.length || 0} testimonials`);
}

// Main migration function
async function main() {
  console.log('🚀 Starting data migration to Supabase...\n');
  
  try {
    // Check connection by trying to query a table
    const { error: galleryError } = await supabase.from('gallery').select('count').limit(1);
    const { error: testimonialsError } = await supabase.from('testimonials').select('count').limit(1);
    
    if (galleryError && galleryError.code !== 'PGRST116') {
      throw new Error(`Gallery table error: ${galleryError.message}`);
    }
    if (testimonialsError && testimonialsError.code !== 'PGRST116') {
      throw new Error(`Testimonials table error: ${testimonialsError.message}`);
    }
    
    console.log('✅ Connected to Supabase\n');
    
    // Migrate data
    await migrateGallery();
    console.log('');
    await migrateTestimonials();
    
    console.log('\n✨ Migration completed!');
    console.log('\nYou can now view your data in the Supabase dashboard:');
    console.log('  - Gallery: Table Editor → gallery');
    console.log('  - Testimonials: Table Editor → testimonials');
    
  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nMake sure:');
    console.error('  1. Your Supabase database is set up (run supabase-setup.sql in SQL Editor)');
    console.error('  2. Your backend/.env file has correct credentials:');
    console.error('     - SUPABASE_URL');
    console.error('     - SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY)');
    console.error('  3. Your Supabase project is active');
    process.exit(1);
  }
}

// Run migration
main();
