"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderPlus,
  Folders,
  ClipboardList,
  UsersRound,
  PanelLeft,
  PanelRight,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    id: "overview",
    label: "Overview",
    href: "/member",
    icon: LayoutDashboard,
  },
  {
    id: "submitproject",
    label: "Submit Project",
    href: "/member/submitproject",
    icon: FolderPlus,
  },
  {
    id: "repository",
    label: "Repository",
    href: "/member/allproject",
    icon: Folders,
  },
  {
    id: "projectstatus",
    label: "Project Status",
    href: "/member/projectstatus",
    icon: ClipboardList,
  },
  {
    id: "grouphub",
    label: "Group Hub",
    href: "/member/grouphub",
    icon: UsersRound,
  },
] as const;

export type SidebarItemId = (typeof navItems)[number]["id"];

type SidebarProps = {
  activeItem?: SidebarItemId;
  onItemSelect?: (item: SidebarItemId) => void;
};

export default function Sidebar({ activeItem, onItemSelect }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Revoke token on backend AND clear the HttpOnly cookie
      await fetch("/next-api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore network errors — still clear local state
    } finally {
      // Clear any remaining local display data
      localStorage.removeItem("user");
      localStorage.removeItem("auth");
      sessionStorage.clear();
      router.push("/");
    }
  };

  return (
    <aside
      className={`
        ${collapsed ? "w-16" : "w-64"} h-full min-h-0
        bg-white border-r border-slate-200
        flex flex-col
        transition-all duration-300 ease-in-out
      `}
    >
      {/* Header */}
      <div
        className={`
          flex items-center border-b border-slate-100 px-3 py-4
          ${collapsed ? "justify-center" : "justify-between"}
        `}
      >
        {!collapsed && (
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-slate-500 select-none">
            Member
          </p>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelRight size={17} /> : <PanelLeft size={17} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-hidden">
        {navItems.map(({ id, label, href, icon: Icon }) => {
          const active = activeItem ? activeItem === id : pathname === href;
          const itemClass = `
            flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            transition-all duration-200 whitespace-nowrap
            ${
              active
                ? "bg-indigo-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
            }
            ${collapsed ? "justify-center" : ""}
          `;

          const content = (
            <>
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </>
          );

          return onItemSelect ? (
            <button
              key={id}
              type="button"
              title={collapsed ? label : undefined}
              className={itemClass}
              onClick={() => onItemSelect(id)}
            >
              {content}
            </button>
          ) : (
            <Link
              key={id}
              href={href}
              title={collapsed ? label : undefined}
              className={itemClass}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-2 py-3 border-t border-slate-200">
        <div
          className={`flex items-center rounded-md bg-slate-100 ${
            collapsed ? "justify-center px-0 py-2" : "gap-3 px-2 py-2"
          }`}
          title={collapsed ? "Member" : undefined}
        >
          <div className="w-7 h-7 shrink-0 rounded-sm bg-indigo-900 text-white flex items-center justify-center text-[10px] font-black">
            MB
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate text-slate-900">Member</p>
              <p className="text-[10px] text-slate-500 truncate">member</p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 ${
            collapsed ? "px-2" : ""
          }`}
        >
          <LogOut size={16} />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
