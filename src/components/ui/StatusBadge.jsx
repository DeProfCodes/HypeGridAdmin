import { cn } from "@/lib/utils";

const statusStyles = {
  "New": "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  "Active": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Approved": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Completed": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Done": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Paid": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Posted": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Converted": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Accepted": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Pending": "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  "Awaiting Payment": "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  "Draft": "bg-slate-500/15 text-slate-400 border-slate-500/30",
  "Requested": "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  "Quoted": "bg-violet-500/15 text-violet-400 border-violet-500/30",
  "In Planning": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Content Pending": "bg-orange-500/15 text-orange-400 border-orange-500/30",
  "Client Review": "bg-violet-500/15 text-violet-400 border-violet-500/30",
  "Review": "bg-violet-500/15 text-violet-400 border-violet-500/30",
  "Cancelled": "bg-slate-500/15 text-slate-500 border-slate-500/30",
  "Rejected": "bg-red-500/15 text-red-400 border-red-500/30",
  "Overdue": "bg-red-500/15 text-red-400 border-red-500/30",
  "Outstanding": "bg-orange-500/15 text-orange-400 border-orange-500/30",
  "Needs Changes": "bg-orange-500/15 text-orange-400 border-orange-500/30",
  "In Progress": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Uploaded": "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  "Not Started": "bg-slate-500/15 text-slate-400 border-slate-500/30",
  "Under Review": "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  "Suspended": "bg-red-500/15 text-red-400 border-red-500/30",
  "Applied": "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  "Archived": "bg-slate-500/15 text-slate-500 border-slate-500/30",
  "Lead": "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  "VIP": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "Inactive": "bg-slate-500/15 text-slate-500 border-slate-500/30",
  "Sent": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Expired": "bg-slate-500/15 text-slate-500 border-slate-500/30",
  "Converted to Invoice": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Partially Paid": "bg-orange-500/15 text-orange-400 border-orange-500/30",
  "On Hold": "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  "Contacted": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Qualified": "bg-violet-500/15 text-violet-400 border-violet-500/30",
  "Quote Needed": "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  "Not Suitable": "bg-slate-500/15 text-slate-500 border-slate-500/30",
  "Closed": "bg-slate-500/15 text-slate-500 border-slate-500/30",
  "Strategy / Planning": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Campaign Live": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

const defaultStyle = "bg-slate-500/15 text-slate-400 border-slate-500/30";

export default function StatusBadge({ status, className }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      statusStyles[status] || defaultStyle,
      className
    )}>
      {status}
    </span>
  );
}