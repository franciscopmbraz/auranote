import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";
import auraNoteLogo from "@/assets/aura-note-logo.png";

const Partilha = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState<{
    inicio: string;
    fim: string;
    resumo: string;
  } | null>(null);

  useEffect(() => {
    const inicio = searchParams.get("inicio");
    const fim = searchParams.get("fim");
    const resumo = searchParams.get("resumo");

    if (inicio && fim && resumo) {
      setSummaryData({ inicio, fim, resumo });
    }
  }, [searchParams]);

  if (!summaryData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Link inválido</CardTitle>
            <CardDescription>
              Este link de partilha não contém dados válidos.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      {/* Header */}
      <header className="border-b border-border/30 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={auraNoteLogo} alt="AURA NOTE" className="h-8 w-8" />
            <span className="font-bold text-xl">AURA NOTE</span>
          </div>
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-6">
          {/* Title Section */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-primary/10">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Relatório Emocional Partilhado</h1>
            <p className="text-muted-foreground text-lg">
              De <span className="font-semibold text-foreground">{summaryData.inicio}</span> a{" "}
              <span className="font-semibold text-foreground">{summaryData.fim}</span>
            </p>
          </div>

          {/* Summary Card */}
          <Card className="shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Resumo do Período</CardTitle>
              <CardDescription>
                Análise emocional gerada pela IA com base nas entradas do diário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {summaryData.resumo.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="leading-relaxed text-foreground/90 mb-4">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-muted-foreground">
                Quer começar a acompanhar as suas emoções também?
              </p>
              <Button onClick={() => navigate("/auth")} size="lg" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Comece gratuitamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Partilha;
