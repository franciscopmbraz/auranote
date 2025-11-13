import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface SummaryDialogProps {
  userEmail: string;
  userId: string;
}

const SummaryDialog = ({ userEmail, userId }: SummaryDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [additionalEmail, setAdditionalEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor preencha as datas de início e fim.",
      });
      return;
    }

    setLoading(true);

    try {
      // Fetch entries for the specified period
      const { data: entriesData, error: entriesError } = await supabase
        .from("diary_entries")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", new Date(startDate).toISOString())
        .lte("created_at", new Date(endDate + "T23:59:59").toISOString())
        .order("created_at", { ascending: false });

      if (entriesError) throw entriesError;

      if (!entriesData || entriesData.length === 0) {
        toast({
          variant: "destructive",
          title: "Sem entradas",
          description: "Não existem entradas no período selecionado.",
        });
        setLoading(false);
        return;
      }

      // Format entries data for AI
      const formattedEntries = entriesData.map(entry => ({
        data: format(new Date(entry.created_at), "dd/MM/yyyy HH:mm"),
        conteudo: entry.content,
        tags: entry.emotion_tags?.join(", ") || "",
        resumo_emocional: entry.emotion_summary || "",
      }));

      // Generate summary with AI
      const { data: summaryData, error: summaryError } = await supabase.functions.invoke(
        "generate-summary",
        {
          body: {
            entries: formattedEntries,
            startDate: format(new Date(startDate), "dd/MM/yyyy"),
            endDate: format(new Date(endDate), "dd/MM/yyyy"),
          },
        }
      );

      if (summaryError) throw summaryError;

      const textSummary = summaryData.textSummary;

      // Save to summaries table
      const { error: insertError } = await supabase
        .from("summaries")
        .insert({
          user_id: userId,
          email: userEmail,
          additional_email: additionalEmail || null,
          start_date: new Date(startDate).toISOString(),
          end_date: new Date(endDate + "T23:59:59").toISOString(),
          html_summary: textSummary,
        } as any);

      if (insertError) throw insertError;

      // Send to Make.com webhook
      const webhookPayload = {
        email_utilizador: userEmail,
        email_adicional: additionalEmail || "",
        data_inicio: format(new Date(startDate), "dd/MM/yyyy"),
        data_fim: format(new Date(endDate), "dd/MM/yyyy"),
        resumo: textSummary,
      };

      await fetch("https://hook.eu2.make.com/53bu39ofylckir9f8kp263jeebdlzdaq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(webhookPayload),
      });

      toast({
        title: "Resumo enviado!",
        description: "O resumo foi guardado e enviado com sucesso.",
      });

      setOpen(false);
      // Reset form
      setAdditionalEmail("");
      setStartDate("");
      setEndDate("");
    } catch (error: any) {
      console.error("Error creating summary:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível criar o resumo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
        >
          <Send className="h-4 w-4" />
          Enviar Resumo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Resumo de Entradas</DialogTitle>
            <DialogDescription>
              Selecione o período e preencha os dados para enviar um resumo das suas entradas.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email do utilizador</Label>
              <Input
                id="email"
                type="email"
                value={userEmail}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="additional-email">Email adicional (opcional)</Label>
              <Input
                id="additional-email"
                type="email"
                placeholder="email@exemplo.com"
                value={additionalEmail}
                onChange={(e) => setAdditionalEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="start-date">Data de início *</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate || undefined}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-date">Data de fim *</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  A enviar...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SummaryDialog;
