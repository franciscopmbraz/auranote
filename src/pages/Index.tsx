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
      <div className="fixed inset-0 pointer-events-none opacity-10 overflow-hidden">
        <BookOpen className="absolute top-20 left-10 w-20 h-20 text-decorative-2 animate-float" style={{ animationDelay: '0s' }} />
        <Pen className="absolute top-40 right-20 w-14 h-14 text-decorative-1 rotate-45 animate-float" style={{ animationDelay: '2s' }} />
        <Notebook className="absolute bottom-32 left-1/4 w-16 h-16 text-decorative-4 animate-float" style={{ animationDelay: '1s' }} />
        <FileText className="absolute top-1/3 right-1/4 w-24 h-24 text-decorative-3 animate-float" style={{ animationDelay: '3s' }} />
        <Pencil className="absolute bottom-20 right-10 w-14 h-14 text-decorative-1 rotate-12 animate-float" style={{ animationDelay: '1.5s' }} />
        <BookMarked className="absolute top-2/3 left-16 w-16 h-16 text-decorative-2 animate-float" style={{ animationDelay: '2.5s' }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            AURA NOTE
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/auth")}
              className="border-border/50 hover:bg-secondary/50"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/auth?mode=signup")}
              className="bg-primary text-primary-foreground hover:opacity-90"
            >
              Criar conta
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        <div className="text-center animate-fade-in relative z-10 max-w-4xl">
          <img src={auraNoteLogo} alt="AURA NOTE" className="h-40 w-auto mx-auto mb-8 drop-shadow-md" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Compreenda as suas emoções através da escrita
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Um diário inteligente que o ajuda a refletir e a crescer emocionalmente
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth?mode=signup")}
            className="bg-primary text-primary-foreground hover:opacity-90 text-lg px-8 py-6 shadow-[var(--shadow-medium)]"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Começar Gratuitamente
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features" 
        data-animate 
        className={`container mx-auto px-6 py-24 transition-all duration-1000 ${
          visibleSections.has('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
          Funcionalidades
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-card p-8 rounded-3xl border border-border/30 space-y-4 hover:border-primary/30 transition-all duration-300">
            <div className="p-4 bg-primary/5 rounded-2xl w-fit">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground">Análise Emocional com IA</h3>
            <p className="text-muted-foreground text-base leading-relaxed">
              A nossa IA analisa automaticamente o seu texto e identifica as emoções presentes.
            </p>
          </div>

          <div className="bg-card p-8 rounded-3xl border border-border/30 space-y-4 hover:border-primary/30 transition-all duration-300">
            <div className="p-4 bg-primary/5 rounded-2xl w-fit">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground">Acompanhe a Evolução</h3>
            <p className="text-muted-foreground text-base leading-relaxed">
              Visualize padrões emocionais ao longo do tempo e identifique tendências.
            </p>
          </div>

          <div className="bg-card p-8 rounded-3xl border border-border/30 space-y-4 hover:border-primary/30 transition-all duration-300">
            <div className="p-4 bg-primary/5 rounded-2xl w-fit">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground">Promova o Autoconhecimento</h3>
            <p className="text-muted-foreground text-base leading-relaxed">
              Desenvolva consciência sobre o seu estado emocional através da escrita.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section 
        id="how-it-works" 
        data-animate 
        className={`container mx-auto px-6 py-24 transition-all duration-1000 delay-200 ${
          visibleSections.has('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
          Como Funciona
        </h2>

        <div className="max-w-4xl mx-auto space-y-12">
          <div className="flex gap-8 items-start">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl">
              1
            </div>
            <div className="pt-2">
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Escreva Livremente</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Partilhe os seus pensamentos e sentimentos sem filtros. Seja autêntico consigo mesmo.
              </p>
            </div>
          </div>

          <div className="flex gap-8 items-start">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl">
              2
            </div>
            <div className="pt-2">
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Análise Automática</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                A nossa IA identifica as emoções predominantes e cria um resumo do seu estado emocional.
              </p>
            </div>
          </div>

          <div className="flex gap-8 items-start">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl">
              3
            </div>
            <div className="pt-2">
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Visualize e Reflita</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Acompanhe o seu histórico emocional e perceba padrões que melhoram o seu bem-estar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="cta" 
        data-animate 
        className={`container mx-auto px-6 py-24 mb-12 text-center transition-all duration-1000 delay-300 ${
          visibleSections.has('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-4xl mx-auto space-y-8 bg-card p-16 rounded-3xl border border-border/30">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Comece Hoje a Sua Jornada
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Milhares de pessoas já melhoraram o seu bem-estar emocional através da escrita
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth?mode=signup")}
            className="bg-primary text-primary-foreground hover:opacity-90 text-lg px-10 py-7 shadow-[var(--shadow-medium)]"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Começar Gratuitamente
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
