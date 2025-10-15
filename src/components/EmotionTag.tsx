import { cn } from "@/lib/utils";

interface EmotionTagProps {
  emotion: string;
  className?: string;
}

const emotionColors: Record<string, string> = {
  feliz: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  triste: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  ansioso: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  calmo: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  energizado: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  cansado: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  motivado: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  frustrado: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  grato: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  esperançoso: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  nostálgico: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  confuso: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  relaxado: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  estressado: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  animado: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
  reflexivo: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  solitário: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
  conectado: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  preocupado: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  otimista: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
};

const EmotionTag = ({ emotion, className }: EmotionTagProps) => {
  const colorClass = emotionColors[emotion.toLowerCase()] || "bg-muted text-muted-foreground";

  return (
    <span
      className={cn(
        "emotion-tag",
        colorClass,
        className
      )}
    >
      {emotion}
    </span>
  );
};

export default EmotionTag;
