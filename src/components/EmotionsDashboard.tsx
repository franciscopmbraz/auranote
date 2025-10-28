import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Calendar, Heart, Smile } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";
import { pt } from "date-fns/locale";

interface DiaryEntryData {
  id: string;
  content: string;
  emotion_summary: string | null;
  emotion_tags: string[];
  created_at: string;
}

interface EmotionsDashboardProps {
  entries: DiaryEntryData[];
}

const EMOTION_COLORS: Record<string, string> = {
  feliz: "hsl(var(--chart-1))",
  triste: "hsl(var(--chart-2))",
  ansioso: "hsl(var(--chart-3))",
  calmo: "hsl(var(--chart-4))",
  animado: "hsl(var(--chart-5))",
  cansado: "hsl(var(--chart-2))",
  grato: "hsl(var(--chart-1))",
  frustrado: "hsl(var(--chart-3))",
  esperançoso: "hsl(var(--chart-4))",
  preocupado: "hsl(var(--chart-3))",
  default: "hsl(var(--muted))",
};

const EmotionsDashboard = ({ entries }: EmotionsDashboardProps) => {
  const stats = useMemo(() => {
    // Contar emoções
    const emotionCount: Record<string, number> = {};
    const dailyEmotions: Record<string, Record<string, number>> = {};
    
    entries.forEach((entry) => {
      const date = format(new Date(entry.created_at), "dd/MM", { locale: pt });
      
      if (!dailyEmotions[date]) {
        dailyEmotions[date] = {};
      }
      
      entry.emotion_tags.forEach((emotion) => {
        const emotionLower = emotion.toLowerCase();
        emotionCount[emotionLower] = (emotionCount[emotionLower] || 0) + 1;
        dailyEmotions[date][emotionLower] = (dailyEmotions[date][emotionLower] || 0) + 1;
      });
    });

    // Preparar dados para gráfico de pizza
    const pieData = Object.entries(emotionCount)
      .map(([emotion, count]) => ({
        name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        value: count,
        fill: EMOTION_COLORS[emotion] || EMOTION_COLORS.default,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // Preparar dados para gráfico de linha (últimos 7 dias)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return format(date, "dd/MM", { locale: pt });
    });

    const lineData = last7Days.map((date) => {
      const dayData: any = { date };
      const emotions = dailyEmotions[date] || {};
      
      Object.entries(emotions).forEach(([emotion, count]) => {
        dayData[emotion] = count;
      });
      
      return dayData;
    });

    // Emoção mais frequente
    const topEmotion = Object.entries(emotionCount).sort((a, b) => b[1] - a[1])[0];

    return {
      totalEntries: entries.length,
      uniqueEmotions: Object.keys(emotionCount).length,
      topEmotion: topEmotion ? topEmotion[0].charAt(0).toUpperCase() + topEmotion[0].slice(1) : "N/A",
      topEmotionCount: topEmotion ? topEmotion[1] : 0,
      pieData,
      lineData,
      allEmotions: Object.keys(emotionCount),
    };
  }, [entries]);

  if (entries.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Heart className="h-12 w-12 opacity-50" />
            <p>Ainda não há dados suficientes para mostrar o dashboard.</p>
            <p className="text-sm">Comece a escrever no seu diário para acompanhar as suas emoções!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartConfig = {
    ...stats.allEmotions.reduce((acc, emotion) => {
      acc[emotion] = {
        label: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        color: EMOTION_COLORS[emotion] || EMOTION_COLORS.default,
      };
      return acc;
    }, {} as any),
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 shadow-[var(--shadow-soft)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Entradas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">{stats.totalEntries}</div>
            <p className="text-xs text-muted-foreground">Entradas registadas</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-[var(--shadow-soft)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emoção Dominante</CardTitle>
            <Smile className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">{stats.topEmotion}</div>
            <p className="text-xs text-muted-foreground">{stats.topEmotionCount} ocorrências</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-[var(--shadow-soft)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variedade Emocional</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">{stats.uniqueEmotions}</div>
            <p className="text-xs text-muted-foreground">Emoções diferentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Evolução */}
        <Card className="border-border/50 shadow-[var(--shadow-medium)]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Evolução Emocional</CardTitle>
            </div>
            <CardDescription>Últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={stats.lineData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                {stats.allEmotions.slice(0, 5).map((emotion) => (
                  <Line
                    key={emotion}
                    type="monotone"
                    dataKey={emotion}
                    stroke={EMOTION_COLORS[emotion] || EMOTION_COLORS.default}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name={emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                  />
                ))}
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Distribuição */}
        <Card className="border-border/50 shadow-[var(--shadow-medium)]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <CardTitle>Distribuição de Emoções</CardTitle>
            </div>
            <CardDescription>Top 6 emoções mais frequentes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmotionsDashboard;
