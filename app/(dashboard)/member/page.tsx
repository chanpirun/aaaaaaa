"use client";

import { useState } from "react";
import Sidebar, { type SidebarItemId } from "@/components/sidebar";
import MemberDashboard from "./member-dashboard";
import AllProject from "./allproject";
import ProjectStatus from "./project-status";
import SubmitProject from "./submitproject";

export default function MemberPage() {
  const [activeItem, setActiveItem] = useState<SidebarItemId>("overview");

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <Sidebar activeItem={activeItem} onItemSelect={setActiveItem} />

      <main className="flex-1 overflow-auto bg-slate-100 p-6 md:p-8">
        <div className="w-full">
          {activeItem === "overview" && <MemberDashboard />}
          {activeItem === "submitproject" && <SubmitProject />}
          {activeItem === "repository" && <AllProject />}
          {activeItem === "projectstatus" && <ProjectStatus />}
        </div>
      </main>
    </div>
  );
}
