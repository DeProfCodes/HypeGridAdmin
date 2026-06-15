import { cn } from "@/lib/utils";

export default function StatCard({ title, value, icon: Icon, trend, variant = "default" }) {
  const variants = {
    default: "border-border/60",
    green: "border-[#39FF14]/20 glow-green-sm",
    cyan: "border-[#00E5FF]/20 glow-cyan",
    purple: "border-violet-500/20",
    red: "border-red-500/20",
  };

  const iconVariants = {
    default: "bg-muted text-muted-foreground",
    green: "bg-[#39FF14]/10 text-[#39FF14]",
    cyan: "bg-[#00E5FF]/10 text-[#00E5FF]",
    purple: "bg-violet-500/10 text-violet-400",
    red: "bg-red-500/10 text-red-400",
  };

  return (
    <div className={cn(
      "glass-card rounded-xl p-5 transition-all duration-300 hover:scale-[1.02]",
      variants[variant]
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold font-heading text-foreground">{value}</p>
          {trend && (
            <p className="text-xs text-emerald-400">
              {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn("p-2.5 rounded-lg", iconVariants[variant])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}