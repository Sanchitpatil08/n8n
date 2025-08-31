import { useState } from "react";
import { 
  BarChart3, 
  Mail, 
  Shield, 
  Star, 
  Users, 
  Bell, 
  MessageSquare,
  Filter,
  Settings,
  Inbox
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const mainItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "All Emails", url: "/emails", icon: Inbox },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const categoryItems = [
  { title: "Customer Support", url: "/label/customer-support", icon: Mail, color: "bg-blue-500" },
  { title: "Spam", url: "/label/spam", icon: Shield, color: "bg-red-500" },
  { title: "Promotional", url: "/label/promotional", icon: Star, color: "bg-purple-500" },
  { title: "Newsletter", url: "/label/newsletter", icon: Bell, color: "bg-green-500" },
  { title: "Social", url: "/label/social", icon: Users, color: "bg-yellow-500" },
  { title: "Unlabeled", url: "/label/unlabeled", icon: MessageSquare, color: "bg-gray-400" },
];

const settingsItems = [
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClasses = (path: string, color?: string) => {
    const active = isActive(path);
    return cn(
      "transition-all duration-200 group relative",
      active 
        ? "bg-dashboard-surface-elevated shadow-dashboard-sm text-dashboard-primary" 
        : "hover:bg-dashboard-surface-elevated/50 text-muted-foreground hover:text-foreground"
    );
  };

  const getCategoryIndicator = (color: string, active: boolean) => (
    <div 
      className={cn(
        "w-2 h-2 rounded-full transition-all duration-200",
        active ? `bg-${color}` : `bg-${color}/40`
      )} 
    />
  );

  return (
    <Sidebar 
      className={cn(
        "border-r border-border bg-dashboard-surface transition-all duration-300",
        state === "collapsed" ? "w-14" : "w-64"
      )}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-dashboard-accent rounded-lg flex items-center justify-center">
            <Mail className="w-4 h-4 text-white" />
          </div>
          {state !== "collapsed" && (
            <div>
              <h1 className="font-semibold text-sm text-dashboard-primary">Email Classify</h1>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-3 mb-2">
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-9">
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="w-4 h-4" />
                      {state !== "collapsed" && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-3 mb-2">
            Labels
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {categoryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-9">
                    <NavLink to={item.url} className={getNavClasses(item.url, item.color)}>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", item.color)} />
                        <item.icon className="w-4 h-4" />
                      </div>
                      {state !== "collapsed" && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-9">
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="w-4 h-4" />
                      {state !== "collapsed" && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}