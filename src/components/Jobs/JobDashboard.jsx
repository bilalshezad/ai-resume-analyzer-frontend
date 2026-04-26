import React, { useState } from "react";
import AddJob from "./AddJob";
import JobList from "./JobList";
import "./JobDashboard.css";
import Header from "../Header/Header";
import { useEffect } from "react";

export default function JobDashboard() {
  const [reload, setReload] = useState(false);

  const refresh = () => setReload(!reload);

useEffect(() => {
  // Page load par current state push
  window.history.pushState(null, "", window.location.href);

  const blockNavigation = () => {
    window.history.pushState(null, "", window.location.href);
  };

  // Back & Forward arrows block
  window.addEventListener("popstate", blockNavigation);

  return () => {
    window.removeEventListener("popstate", blockNavigation);
  };
}, []);

  return (
    <>
      <Header />
      <div className="job-dashboard-page">
        <div className="dashboard-container">
          <div className="add-job-section glass-card">
            <AddJob reload={refresh} />
          </div>
          <div className="job-list-section">
            <JobList reload={reload} />
          </div>
        </div>
      </div>
    </>
  );
}
