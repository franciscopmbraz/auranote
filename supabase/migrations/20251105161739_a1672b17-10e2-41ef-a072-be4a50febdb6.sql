-- Create summaries table
CREATE TABLE public.summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  additional_email TEXT,
  period TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  entries_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own summaries" 
ON public.summaries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own summaries" 
ON public.summaries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own summaries" 
ON public.summaries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own summaries" 
ON public.summaries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_summaries_updated_at
BEFORE UPDATE ON public.summaries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();