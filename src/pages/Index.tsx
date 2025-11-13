import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, TrendingUp, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import auraNoteLogo from "@/assets/aura-note-logo.png";

const Index = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-lg font-semibold text-primary">AURA NOTE</div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/auth")}
              className="hover:bg-accent"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/auth?mode=signup")}
              className="bg-gradient-to-r from-primary to-primary-dark hover:opacity-90"
            >
              Criar conta
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary-light/10 flex items-center justify-center pt-20">
        <div className="text-center animate-fade-in">
          <img src={auraNoteLogo} alt="AURA NOTE" className="h-32 w-auto mx-auto" />
          <p className="text-muted-foreground mt-6 text-lg">
            Compreenda as suas emoções através da escrita
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
