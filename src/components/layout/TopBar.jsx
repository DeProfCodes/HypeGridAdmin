import { useState } from "react";
import { Menu, Search, Bell, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

export default function TopBar({ onMenuClick, userRole, onRoleChange }) {
  const roles = ["admin", "campaign_manager", "finance", "client", "creator"];
  const roleLabels = {
    admin: "Super Admin",
    campaign_manager: "Campaign Manager",
    finance: "Finance",
    client: "Client",
    creator: "Creator"
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="lg:hidden text-muted-foreground hover:text-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns, clients, creators..."
              className="w-80 pl-10 bg-muted/50 border-border/40 text-sm h-9 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Role Switcher (demo) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 text-xs border-border/40 bg-muted/30">
                <span className="hidden sm:inline text-muted-foreground">Role:</span>
                <span className="text-primary font-semibold">{roleLabels[userRole]}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-muted-foreground">Switch Demo Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {roles.map((role) => (
                <DropdownMenuItem key={role} onClick={() => onRoleChange(role)} className="text-sm">
                  {roleLabels[role]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs">
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quick Action</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild><Link to="/campaigns">New Campaign</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/clients">Add Client</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/creators">Add Creator</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/quotes">Create Quote</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/payments">Record Payment</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center text-xs font-bold text-foreground">
                HG
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/settings">Settings</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}