import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate, Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar/DashboardSidebar";
import DashBoardMenu from "./DashboardMenu/DashBoardMenu";
import { DashboardComp } from "../../components/Dashboard/Dashboard";
import styles from "./dashboard.module.scss";

export default function Dashboard() {
  const [context, setContext] = useOutletContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (context.user && !context.user.houseShareId) {
      navigate("/house");
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth < 575) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  });

  return (
    <div className={styles.DashboardContainer}>
      <DashboardSidebar
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
        setContext={setContext}
      />
      <div className={styles.dashboardContent}>
        <DashBoardMenu setSidebarOpen={setSidebarOpen} />
        <Outlet context={[context, setContext]} />
      </div>
    </div>
  );
}
