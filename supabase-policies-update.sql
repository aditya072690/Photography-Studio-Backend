-- Additional Supabase Policies for Update and Delete Operations
-- Run this in your Supabase SQL Editor to allow update/delete operations

-- Update policies for gallery
CREATE POLICY "Public update access for gallery" ON gallery
  FOR UPDATE USING (true)
  WITH CHECK (true);

CREATE POLICY "Public delete access for gallery" ON gallery
  FOR DELETE USING (true);

-- Update policies for testimonials
CREATE POLICY "Public update access for testimonials" ON testimonials
  FOR UPDATE USING (true)
  WITH CHECK (true);

CREATE POLICY "Public delete access for testimonials" ON testimonials
  FOR DELETE USING (true);

-- Note: If you want to restrict these operations to authenticated users only,
-- replace 'true' with 'auth.role() = ''authenticated'''

