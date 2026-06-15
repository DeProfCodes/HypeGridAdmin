import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { hypegrid } from "@/api/hypegridClient";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { data: campaigns = [] } = useQuery({ queryKey: ["campaigns"], queryFn: () => hypegrid.entities.Campaign.list() });
  const { data: deliverables = [] } = useQuery({ queryKey: ["deliverables"], queryFn: () => hypegrid.entities.Deliverable.list() });

  const events = useMemo(() => {
    const items = [];
    campaigns.forEach(c => {
      if (c.start_date) items.push({ date: c.start_date, title: c.name, type: "launch", color: "bg-emerald-500" });
      if (c.end_date) items.push({ date: c.end_date, title: `${c.name} ends`, type: "end", color: "bg-blue-500" });
    });
    deliverables.forEach(d => {
      if (d.due_date) items.push({ date: d.due_date, title: d.title, type: "content", color: d.status === "Overdue" || d.status === "Needs Changes" ? "bg-red-500" : "bg-cyan-500" });
    });
    return items;
  }, [campaigns, deliverables]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const getEventsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(e => e.date === dateStr);
  };

  const isToday = (day) => day && today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading">Campaign Calendar</h1>
        <p className="text-sm text-muted-foreground">View scheduled campaigns, content, and deadlines.</p>
      </div>

      <div className="glass-card rounded-xl border border-border/40 p-5">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="w-5 h-5" /></Button>
          <h2 className="text-lg font-bold font-heading">{MONTHS[month]} {year}</h2>
          <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="w-5 h-5" /></Button>
        </div>

        <div className="grid grid-cols-7 gap-px">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
          ))}
          {days.map((day, i) => {
            const dayEvents = getEventsForDay(day);
            return (
              <div key={i} className={cn(
                "min-h-[80px] md:min-h-[100px] border border-border/20 p-1.5 rounded-lg",
                day ? "bg-card/30" : "bg-transparent",
                isToday(day) && "ring-1 ring-primary/40"
              )}>
                {day && (
                  <>
                    <span className={cn("text-xs font-medium", isToday(day) ? "text-primary" : "text-muted-foreground")}>{day}</span>
                    <div className="mt-1 space-y-0.5">
                      {dayEvents.slice(0, 3).map((e, j) => (
                        <div key={j} className={cn("text-[10px] px-1.5 py-0.5 rounded truncate text-white font-medium", e.color)}>
                          {e.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 3} more</span>}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><div className="w-3 h-3 rounded bg-emerald-500" /> Campaign Launch</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><div className="w-3 h-3 rounded bg-cyan-500" /> Content Due</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><div className="w-3 h-3 rounded bg-blue-500" /> Campaign End</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><div className="w-3 h-3 rounded bg-red-500" /> Overdue</div>
      </div>
    </div>
  );
}