import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmotionTag from "./EmotionTag";
import { Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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

interface DiaryEntryProps {
  id: string;
  content: string;
  emotionSummary: string | null;
  emotionTags: string[];
  createdAt: string;
  onDelete: (id: string) => void;
}

const DiaryEntry = ({ id, content, emotionSummary, emotionTags, createdAt, onDelete }: DiaryEntryProps) => {
  return (
    <Card className="card-hover border-border/50">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <time dateTime={createdAt}>
              {format(new Date(createdAt), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
            </time>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apagar entrada?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser revertida. Esta entrada será permanentemente apagada.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Apagar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
          {content}
        </p>

        {emotionSummary && (
          <div className="pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground italic">
              {emotionSummary}
            </p>
          </div>
        )}

        {emotionTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {emotionTags.map((tag, index) => (
              <EmotionTag key={index} emotion={tag} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiaryEntry;
