import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";
import auraNoteLogo from "@/assets/aura-note-logo.png";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Bem-vindo de volta!",
          description: "Login realizado com sucesso.",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) throw error;

        toast({
          title: "Conta criada!",
          description: "Pode fazer login agora.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Ocorreu um erro. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-secondary/20 to-background">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={auraNoteLogo} alt="AURA NOTE" className="h-16 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            AURA NOTE
          </h1>
          <p className="text-muted-foreground">
            Compreenda as suas emoções através da escrita
          </p>
        </div>

        <Card className="shadow-[var(--shadow-medium)] border-border/50">
          <CardHeader>
            <CardTitle>{isLogin ? "Entrar" : "Criar Conta"}</CardTitle>
            <CardDescription>
              {isLogin
                ? "Entre na sua conta para continuar"
                : "Crie uma conta para começar a refletir"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all focus:shadow-[var(--shadow-soft)]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Palavra-passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="transition-all focus:shadow-[var(--shadow-soft)]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 transition-all duration-300 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)]"
                disabled={loading}
              >
                {loading ? "A processar..." : isLogin ? "Entrar" : "Criar Conta"}
              </Button>

              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:text-primary-dark transition-colors underline-offset-4 hover:underline"
                >
                  {isLogin
                    ? "Ainda não tem conta? Criar conta"
                    : "Já tem conta? Entrar"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
