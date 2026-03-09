-- 1. Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Credits (current active subscription/free plan)
CREATE TABLE public.credits (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  balance INTEGER NOT NULL DEFAULT 90,
  plan_type TEXT NOT NULL DEFAULT 'free', -- 'free', 'starter', 'pro', 'business'
  cycle_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cycle_end TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '15 days',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own credits" ON public.credits FOR SELECT USING (auth.uid() = user_id);

-- 3. Credit Ledger (transaction history)
CREATE TABLE public.credit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL, -- negative for debit, positive for credit
  reason TEXT NOT NULL, -- e.g., 'job_create', 'export', 'cycle_refill'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own ledger" ON public.credit_ledger FOR SELECT USING (auth.uid() = user_id);

-- 4. Clips (the created videos)
CREATE TABLE public.clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  source_url TEXT NOT NULL,
  template_id TEXT NOT NULL, -- 'recess', 'neon', etc.
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  category TEXT, -- 'podcast', 'vlog', etc.
  thumbnail_url TEXT,
  preview_url TEXT,
  duration INTEGER, -- in seconds
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.clips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can fully manage own clips" ON public.clips FOR ALL USING (auth.uid() = user_id);

-- 5. Clip Assets (captions, timings, etc. for the Editor)
CREATE TABLE public.clip_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clip_id UUID REFERENCES public.clips(id) ON DELETE CASCADE NOT NULL,
  captions JSONB,
  format_settings JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.clip_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can fully manage own clip assets" ON public.clip_assets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.clips WHERE clips.id = clip_assets.clip_id AND clips.user_id = auth.uid())
);

-- 6. Exports
CREATE TABLE public.exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clip_id UUID REFERENCES public.clips(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  download_url TEXT,
  watermarked BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can fully manage own exports" ON public.exports FOR ALL USING (auth.uid() = user_id);

-- Trigger to create profile and initial credits on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  
  INSERT INTO public.credits (user_id, balance, plan_type, cycle_start, cycle_end)
  VALUES (new.id, 90, 'free', NOW(), NOW() + INTERVAL '15 days');
  
  INSERT INTO public.credit_ledger (user_id, amount, reason)
  VALUES (new.id, 90, 'initial_grant');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
