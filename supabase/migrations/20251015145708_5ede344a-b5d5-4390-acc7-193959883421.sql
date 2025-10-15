-- Criar tabela de perfis de utilizador
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Ativar Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Criar tabela de entradas de diário
CREATE TABLE public.diary_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  emotion_summary TEXT,
  emotion_tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ativar Row Level Security
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para diary_entries
CREATE POLICY "Users can view their own diary entries"
  ON public.diary_entries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diary entries"
  ON public.diary_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diary entries"
  ON public.diary_entries
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diary entries"
  ON public.diary_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_diary_entries_updated_at
  BEFORE UPDATE ON public.diary_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função para criar perfil automaticamente no signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Trigger para criar perfil no signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Índices para performance
CREATE INDEX idx_diary_entries_user_id ON public.diary_entries(user_id);
CREATE INDEX idx_diary_entries_created_at ON public.diary_entries(created_at DESC);