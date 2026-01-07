-- Add admin role support to employers table
ALTER TABLE public.employers
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create policy for admins to view all employers
DROP POLICY IF EXISTS "Admins can view all employers" ON public.employers;
CREATE POLICY "Admins can view all employers" ON public.employers
  FOR SELECT USING (
    (SELECT is_admin FROM public.employers WHERE id = auth.uid()) = true
  );

-- Create policy for admins to update any employer
DROP POLICY IF EXISTS "Admins can update any employer" ON public.employers;
CREATE POLICY "Admins can update any employer" ON public.employers
  FOR UPDATE USING (
    (SELECT is_admin FROM public.employers WHERE id = auth.uid()) = true
  );

-- Create policy for admins to view all athletes
DROP POLICY IF EXISTS "Admins can view all athletes" ON public.athletes;
CREATE POLICY "Admins can view all athletes" ON public.athletes
  FOR SELECT USING (
    (SELECT is_admin FROM public.employers WHERE id = auth.uid()) = true
  );

-- Create admin dashboard view
CREATE OR REPLACE VIEW admin_stats AS
SELECT
  (SELECT COUNT(*) FROM public.athletes) as total_athletes,
  (SELECT COUNT(*) FROM public.employers) as total_employers,
  (SELECT COUNT(*) FROM public.employers WHERE subscription_tier = 'pro') as pro_subscribers,
  (SELECT COUNT(*) FROM public.conversations) as total_conversations,
  (SELECT COUNT(*) FROM public.messages) as total_messages;

-- Grant access to admin stats view
GRANT SELECT ON admin_stats TO authenticated;
