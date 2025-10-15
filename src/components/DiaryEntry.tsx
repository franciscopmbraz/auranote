import { Card, CardContent } from "@/components/ui/card";
import EmotionTag from "./EmotionTag";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DiaryEntryProps {
  content: string;
  emotionSummary: string | null;
  emotionTags: string[];
  createdAt: string;
}

const DiaryEntry = ({ content, emotionSummary, emotionTags, createdAt }: DiaryEntryProps) => {
  return (
    <Card className="card-hover border-border/50">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <time dateTime={createdAt}>
            {format(new Date(createdAt), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
          </time>
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
