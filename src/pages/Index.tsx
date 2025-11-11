import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Mail, Lock, Loader2, Sparkles, TrendingUp, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Bem-vindo de volta!",
        description: "Login realizado com sucesso.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erro ao entrar",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* Login Section */}
      <section className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary-light/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-background shadow-[var(--shadow-strong)]">
              <Brain className="h-8 w-8 text-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">AURA NOTE</h1>
          </div>

          {/* Login Card */}
          <Card className="shadow-[var(--shadow-strong)] border-border/50">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl">Bem-vindo</CardTitle>
              <CardDescription>
                Entre com sua conta para acessar seu diário emocional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 transition-all duration-300"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>

              <div className="mt-6 space-y-3 text-center text-sm">
                <button
                  onClick={() => navigate("/auth?mode=signup")}
                  className="text-primary hover:underline font-medium transition-all"
                >
                  Criar conta
                </button>
                <div className="text-muted-foreground">
                  <button
                    onClick={() => navigate("/auth?mode=reset")}
                    className="hover:text-foreground transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Note */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Seus dados são privados e seguros. Apenas você tem acesso ao seu diário.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gradient">
          Compreenda as suas emoções através da escrita
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card p-8 rounded-2xl shadow-[var(--shadow-medium)] border border-border/50 space-y-4 card-hover">
            <div className="p-3 bg-primary/10 rounded-xl w-fit">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Análise Emocional com IA</h3>
            <p className="text-muted-foreground">
              A nossa IA analisa automaticamente o seu texto e identifica as emoções presentes, ajudando-o a compreender melhor os seus sentimentos.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-[var(--shadow-medium)] border border-border/50 space-y-4 card-hover">
            <div className="p-3 bg-accent/10 rounded-xl w-fit">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Acompanhe a Sua Evolução</h3>
            <p className="text-muted-foreground">
              Visualize padrões emocionais ao longo do tempo e identifique tendências para melhorar o seu bem-estar diário.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-[var(--shadow-medium)] border border-border/50 space-y-4 card-hover">
            <div className="p-3 bg-primary-light/20 rounded-xl w-fit">
              <Heart className="h-6 w-6 text-primary-dark" />
            </div>
            <h3 className="text-xl font-semibold">Promova o Autoconhecimento</h3>
            <p className="text-muted-foreground">
              Através da reflexão escrita e feedback visual, desenvolva uma maior consciência sobre o seu estado emocional.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-secondary/30 rounded-3xl my-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gradient">
          Como Funciona
        </h2>

        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-[var(--shadow-soft)]">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Escreva Livremente</h3>
              <p className="text-muted-foreground">
                Partilhe os seus pensamentos, sentimentos e experiências do dia sem filtros. Seja autêntico consigo mesmo.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-[var(--shadow-soft)]">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Análise Automática</h3>
              <p className="text-muted-foreground">
                A nossa IA processa o seu texto e identifica as emoções predominantes, criando um resumo do seu estado emocional.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-[var(--shadow-soft)]">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Visualize e Reflita</h3>
              <p className="text-muted-foreground">
                Acompanhe o seu histórico emocional com tags visuais e perceba padrões que o ajudam a melhorar o seu bem-estar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8 bg-gradient-to-r from-primary/10 to-primary-dark/10 p-12 rounded-3xl border border-primary/20 shadow-[var(--shadow-strong)]">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient">
            Comece a Sua Jornada de Autoconhecimento
          </h2>
          <p className="text-xl text-muted-foreground">
            Junte-se a milhares de pessoas que já melhoraram o seu bem-estar emocional através da escrita
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth?mode=signup")}
            className="bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 transition-all duration-300 shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-strong)] text-lg px-8 py-6"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Começar Agora
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
