import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState("admin");

  return (
    <div className="flex h-screen overflow-hidden bg-background grid-bg">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={userRole}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          userRole={userRole}
          onRoleChange={setUserRole}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet context={{ userRole }} />
        </main>
      </div>
    </div>
  );
}