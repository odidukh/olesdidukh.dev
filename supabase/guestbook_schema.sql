-- Schema for Guestbook / Hall of Fame

-- Create the guestbook_entries table
CREATE TABLE IF NOT EXISTS public.guestbook_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT NOT NULL,
    message TEXT NOT NULL CHECK (char_length(message) <= 500)
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;

-- Allow public read access (everyone can see the guestbook)
CREATE POLICY "Public profiles are viewable by everyone."
ON public.guestbook_entries FOR SELECT
USING (true);

-- Allow authenticated users to insert their own entries
CREATE POLICY "Users can insert their own entries."
ON public.guestbook_entries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- (Optional) If you want users to be able to delete their own entries
CREATE POLICY "Users can delete their own entries."
ON public.guestbook_entries FOR DELETE
USING (auth.uid() = user_id);
