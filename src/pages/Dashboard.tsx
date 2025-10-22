import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Brain, LogOut, PenLine, Sparkles, Loader2, Trash2 } from "lucide-react";
import DiaryEntry from "@/components/DiaryEntry";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Session } from "@supabase/supabase-js";

interface DiaryEntryData {
  id: string;
  content: string;
  emotion_summary: string | null;
  emotion_tags: string[];
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState<DiaryEntryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setSession(session);
        fetchEntries();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("diary_entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const analyzeEmotion = async (text: string) => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-emotion", {
        body: { content: text },
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Error analyzing emotion:", error);
      toast({
        variant: "destructive",
        title: "Erro na análise",
        description: "Não foi possível analisar as emoções. Tente novamente.",
      });
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !session) return;

    setLoading(true);

    try {
      // Analyze emotion first
      const analysis = await analyzeEmotion(content);

      // Save entry
      const { error } = await supabase.from("diary_entries").insert({
        user_id: session.user.id,
        content: content.trim(),
        emotion_summary: analysis?.summary || null,
        emotion_tags: analysis?.tags || [],
      });

      if (error) throw error;

      toast({
        title: "Entrada guardada!",
        description: "O seu diário foi atualizado com sucesso.",
      });

      setContent("");
      fetchEntries();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível guardar a entrada.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from("diary_entries")
        .delete()
        .eq("id", entryId);

      if (error) throw error;

      toast({
        title: "Entrada apagada!",
        description: "A entrada foi removida com sucesso.",
      });

      fetchEntries();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível apagar a entrada.",
      });
    }
  };

  const handleDeleteAllEntries = async () => {
    if (!session) return;

    try {
      const { error } = await supabase
        .from("diary_entries")
        .delete()
        .eq("user_id", session.user.id);

      if (error) throw error;

      toast({
        title: "Todas as entradas apagadas!",
        description: "O seu diário foi limpo com sucesso.",
      });

      setEntries([]);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível apagar as entradas.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-[var(--shadow-soft)]">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">Diário Emocional</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <Card className="shadow-[var(--shadow-medium)] border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PenLine className="h-5 w-5 text-primary" />
              <CardTitle>Escrever nova entrada</CardTitle>
            </div>
            <CardDescription>
              Partilhe os seus pensamentos e sentimentos de hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Como se sentiu hoje? Escreva livremente sobre o seu dia..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="resize-none transition-all focus:shadow-[var(--shadow-soft)]"
                disabled={loading || analyzing}
              />

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  {analyzing && (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      A analisar emoções...
                    </>
                  )}
                </p>
                <Button
                  type="submit"
                  disabled={!content.trim() || loading || analyzing}
                  className="bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 transition-all duration-300 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] gap-2"
                >
                  {loading || analyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      A processar...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Guardar e Analisar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">As suas entradas</h2>
            {entries.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Apagar todas
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser revertida. Todas as suas entradas do diário serão permanentemente apagadas.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAllEntries}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Apagar todas
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          {entries.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                  <Brain className="h-12 w-12 opacity-50" />
                  <p>Ainda não tem entradas no diário.</p>
                  <p className="text-sm">
                    Comece a escrever para acompanhar o seu estado emocional!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {entries.map((entry) => (
                <DiaryEntry
                  key={entry.id}
                  id={entry.id}
                  content={entry.content}
                  emotionSummary={entry.emotion_summary}
                  emotionTags={entry.emotion_tags}
                  createdAt={entry.created_at}
                  onDelete={handleDeleteEntry}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
