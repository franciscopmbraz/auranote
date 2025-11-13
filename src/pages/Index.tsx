import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, TrendingUp, Heart, BookOpen, Pen, Notebook, FileText, Pencil, BookMarked } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import auraNoteLogo from "@/assets/aura-note-logo.png";

const Index = () => {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkUser();

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative floating icons */}
      <div className="fixed inset-0 pointer-events-none opacity-5 overflow-hidden">
        <BookOpen className="absolute top-20 left-10 w-24 h-24 text-primary animate-float" style={{ animationDelay: '0s' }} />
        <Pen className="absolute top-40 right-20 w-16 h-16 text-accent rotate-45 animate-float" style={{ animationDelay: '2s' }} />
        <Notebook className="absolute bottom-32 left-1/4 w-20 h-20 text-primary-dark animate-float" style={{ animationDelay: '1s' }} />
        <FileText className="absolute top-1/3 right-1/4 w-28 h-28 text-primary-light animate-float" style={{ animationDelay: '3s' }} />
        <Pencil className="absolute bottom-20 right-10 w-16 h-16 text-accent rotate-12 animate-float" style={{ animationDelay: '1.5s' }} />
        <BookMarked className="absolute top-2/3 left-16 w-20 h-20 text-primary animate-float" style={{ animationDelay: '2.5s' }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-lg font-semibold text-primary flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            AURA NOTE
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/auth")}
              className="hover:bg-accent hover-scale"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/auth?mode=signup")}
              className="bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 hover-scale"
            >
              Criar conta
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 relative">
        <div className="text-center animate-fade-in relative z-10">
          <img src={auraNoteLogo} alt="AURA NOTE" className="h-32 w-auto mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto px-4">
            Compreenda as suas emoções através da escrita
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features" 
        data-animate 
        className={`container mx-auto px-4 py-20 transition-all duration-1000 ${
          visibleSections.has('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gradient flex items-center justify-center gap-3">
          <Pen className="w-8 h-8 text-primary" />
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
      <section 
        id="how-it-works" 
        data-animate 
        className={`container mx-auto px-4 py-20 bg-secondary/20 rounded-3xl my-12 transition-all duration-1000 delay-200 ${
          visibleSections.has('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gradient flex items-center justify-center gap-3">
          <Notebook className="w-8 h-8 text-primary" />
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
      <section 
        id="cta" 
        data-animate 
        className={`container mx-auto px-4 py-20 text-center transition-all duration-1000 delay-300 ${
          visibleSections.has('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
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
