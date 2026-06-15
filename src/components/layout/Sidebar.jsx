import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Megaphone, Inbox, Users, Palette, FileCheck,
  Calendar, FileText, CreditCard, Wallet, BarChart3, UsersRound,
  Settings, X, Briefcase, ChevronLeft, Images, Tag, Video, Activity
} from "lucide-react";

const adminNav = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Campaigns", path: "/campaigns", icon: Megaphone },
  { label: "Requests", path: "/requests", icon: Inbox },
  { label: "Clients", path: "/clients", icon: Briefcase },
  { label: "Creators", path: "/creators", icon: Palette },
  { label: "Deliverables", path: "/deliverables", icon: FileCheck },
  { label: "Calendar", path: "/calendar", icon: Calendar },
  { label: "Quotes", path: "/quotes", icon: FileText },
  { label: "Payments", path: "/payments", icon: CreditCard },
  { label: "Payouts", path: "/payouts", icon: Wallet },
  { label: "Reports", path: "/reports", icon: BarChart3 },
  { section: "Marketing" },
  { label: "Hero Ads", path: "/hero-ads", icon: Images },
  { label: "Deals & Specials", path: "/deals", icon: Tag },
  { label: "Featured Video", path: "/featured-video", icon: Video },
  { label: "Placement Analytics", path: "/placement-analytics", icon: Activity },
  { section: "Admin" },
  { label: "Team", path: "/team", icon: UsersRound },
  { label: "Settings", path: "/settings", icon: Settings },
];

const clientNav = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "My Campaigns", path: "/campaigns", icon: Megaphone },
  { label: "Quotes", path: "/quotes", icon: FileText },
  { label: "Invoices", path: "/payments", icon: CreditCard },
  { label: "Deliverables", path: "/deliverables", icon: FileCheck },
  { label: "Reports", path: "/reports", icon: BarChart3 },
  { label: "Messages", path: "/messages", icon: Inbox },
];

const creatorNav = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Assignments", path: "/campaigns", icon: Megaphone },
  { label: "Deliverables", path: "/deliverables", icon: FileCheck },
  { label: "Earnings", path: "/payouts", icon: Wallet },
  { label: "Messages", path: "/messages", icon: Inbox },
];

export default function Sidebar({ isOpen, onClose, userRole = "admin" }) {
  const location = useLocation();

  const navItems = userRole === "client" ? clientNav
    : userRole === "creator" ? creatorNav
    : adminNav;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300",
        "lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo area */}
        <div className="p-5 flex items-center justify-between border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-sm font-display">H</span>
            </div>
            <span className="text-lg font-bold font-display text-foreground tracking-tight">HypeGrid</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            if (item.section) {
              return (
                <p key={`sec-${item.section}`} className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {item.section}
                </p>
              );
            }
            const isActive = location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className={cn("w-4.5 h-4.5", isActive && "text-sidebar-primary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-bold text-foreground">HG</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">HypeGrid Admin</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}