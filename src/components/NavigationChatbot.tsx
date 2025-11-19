import { useState } from "react";
import { MessageCircle, X, Home, BarChart3, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const NavigationChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const navigationOptions = [
    {
      icon: Home,
      label: "Ir para Início",
      description: "Voltar à página inicial",
      action: () => navigate("/"),
    },
    {
      icon: BarChart3,
      label: "Ver Dashboard",
      description: "Visualizar análises e estatísticas",
      action: () => navigate("/dashboard"),
    },
    {
      icon: User,
      label: "Fazer Login",
      description: "Aceder à sua conta",
      action: () => navigate("/auth"),
    },
    {
      icon: LogOut,
      label: "Terminar Sessão",
      description: "Sair da conta",
      action: async () => {
        await supabase.auth.signOut();
        toast({
          title: "Sessão terminada",
          description: "Até breve!",
        });
        navigate("/auth");
      },
    },
  ];

  return (
    <>
      {/* Botão flutuante */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-strong bg-primary hover:bg-primary-light transition-all z-50"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Janela do chat */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 shadow-strong z-50 bg-card border-border">
          <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
            <h3 className="font-semibold text-lg">Aura Ajuda</h3>
            <p className="text-sm opacity-90">Como posso ajudar?</p>
          </div>
          
          <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
            {navigationOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    option.action();
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-accent/50 transition-colors flex items-start gap-3 group"
                >
                  <Icon className="h-5 w-5 text-primary mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium text-foreground">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      )}
    </>
  );
};

export default NavigationChatbot;
