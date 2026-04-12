import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import BackgroundFx from "../../components/backgroundfx";
import { getAllUsers } from "../../services/userService";
import { getAllReports } from "../../services/reportService";
import { getSchedules } from "../../services/scheduleService";
import { getAnnouncements } from "../../services/announcementService";

const MotionDiv = motion.div;

const AdminDashboard = () => {
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersData, reportsData, schedulesData, announcementsData] =
          await Promise.all([
            getAllUsers(userInfo.token),
            getAllReports(userInfo.token),
            getSchedules(userInfo.token),
            getAnnouncements(userInfo.token),
          ]);

        setUsers(Array.isArray(usersData) ? usersData : []);
        setReports(Array.isArray(reportsData) ? reportsData : []);
        setSchedules(Array.isArray(schedulesData) ? schedulesData : []);
        setAnnouncements(Array.isArray(announcementsData) ? announcementsData : []);
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.token) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [userInfo?.token]);

  const pendingReports = useMemo(() => {
    return reports.filter(
      (report) => String(report.status || "").toLowerCase() === "pending"
    ).length;
  }, [reports]);

  const recentReports = useMemo(() => {
    return [...reports].slice(0, 2);
  }, [reports]);

  const recentAnnouncements = useMemo(() => {
    return [...announcements].slice(0, 2);
  }, [announcements]);

  const sidebarLinks = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/schedules", label: "Manage Schedules" },
    { to: "/admin/reports", label: "Manage Reports" },
    { to: "/admin/users", label: "Manage Users" },
    { to: "/admin/announcements", label: "Manage Announcements" },
  ];

  const statCards = [
    {
      label: "Total Users",
      value: users.length,
      helper: "Registered users",
    },
    {
      label: "Total Reports",
      value: reports.length,
      helper: "Submitted reports",
    },
    {
      label: "Total Schedules",
      value: schedules.length,
      helper: "Schedule records",
    },
    {
      label: "Announcements",
      value: announcements.length,
      helper: "Published notices",
    },
  ];

  const chartData = [
    { label: "Users", value: users.length },
    { label: "Reports", value: reports.length },
    { label: "Schedules", value: schedules.length },
    { label: "Announcements", value: announcements.length },
    { label: "Pending", value: pendingReports },
  ];

  const maxChartValue = Math.max(...chartData.map((item) => item.value), 1);

  const donutValues = [
    { label: "Users", value: users.length, color: "#6ee7b7" },
    { label: "Reports", value: reports.length, color: "#34d399" },
    { label: "Schedules", value: schedules.length, color: "#10b981" },
    { label: "Announcements", value: announcements.length, color: "#2dd4bf" },
  ];

  const donutTotal = Math.max(
    donutValues.reduce((sum, item) => sum + item.value, 0),
    1
  );

  let accumulatedPercent = 0;
  const donutSegments = donutValues.map((item) => {
    const percent = (item.value / donutTotal) * 100;
    const segment = {
      ...item,
      percent,
      dashArray: `${percent} ${100 - percent}`,
      dashOffset: -accumulatedPercent,
    };
    accumulatedPercent += percent;
    return segment;
  });

  return (
    <div className="app-shell h-screen overflow-hidden">
      <BackgroundFx />

      <div className="relative z-10 flex h-screen gap-4 p-3 lg:p-4">
        <aside className="hidden h-full w-[250px] shrink-0 rounded-[28px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl xl:flex xl:flex-col">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-100/50">
              Admin Panel
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-emerald-50">
              Control Center
            </h1>
            <p className="mt-2 text-sm leading-6 text-emerald-100/65">
              Administrative access for schedules, reports, users, and official announcements.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {sidebarLinks.map((item) => {
              const active = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block rounded-[20px] border px-4 py-3 transition duration-300 ${
                    active
                      ? "border-emerald-300/20 bg-emerald-400/10 text-white shadow-[0_0_0_1px_rgba(52,211,153,0.08)]"
                      : "border-white/10 bg-black/20 text-emerald-100/78 hover:border-emerald-300/20 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <p className="text-sm font-semibold">{item.label}</p>
                </Link>
              );
            })}
          </div>

          <div className="mt-auto">
            <Link
              to="/home"
              className="flex items-center justify-center rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 text-sm font-semibold text-emerald-50 transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.05]"
            >
              Back to Home
            </Link>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden pr-1">
          <div className="flex shrink-0 items-center justify-between rounded-[24px] border border-white/10 bg-white/[0.06] px-4 py-3 shadow-[0_14px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100/50">
                Administrative Dashboard
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-emerald-50">
                System Overview
              </h2>
            </div>

            <Link
              to="/home"
              className="rounded-[14px] border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-emerald-50 transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.05] xl:hidden"
            >
              Home
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-1 items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.05] shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
              <div className="text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-emerald-300/20 border-t-emerald-300" />
                <p className="text-sm font-medium text-emerald-100/75">
                  Loading admin data...
                </p>
              </div>
            </div>
          ) : (
            <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
              <MotionDiv
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex min-h-0 flex-col gap-4"
              >
                <section className="grid shrink-0 gap-4 sm:grid-cols-2">
                  {statCards.map((card, index) => (
                    <MotionDiv
                      key={card.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.04 + index * 0.04 }}
                      className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                        {card.label}
                      </p>
                      <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-50">
                        {card.value}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-emerald-100/65">
                        {card.helper}
                      </p>
                    </MotionDiv>
                  ))}
                </section>

                <section className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                        System Distribution
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-emerald-50">
                        Core records chart
                      </h3>
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/60">
                      Live Counts
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="grid h-[210px] items-end gap-4 rounded-[20px] border border-white/8 bg-black/20 p-4">
                      <div className="flex h-full items-end justify-between gap-3">
                        {chartData.map((item) => {
                          const height = `${Math.max(
                            (item.value / maxChartValue) * 100,
                            12
                          )}%`;

                          return (
                            <div
                              key={item.label}
                              className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                            >
                              <span className="text-sm font-bold text-emerald-300">
                                {item.value}
                              </span>
                              <div className="flex h-full w-full items-end justify-center">
                                <div
                                  className="w-full max-w-[72px] rounded-t-[18px] border border-emerald-300/15 bg-gradient-to-t from-emerald-500/70 via-emerald-400/40 to-emerald-300/20 shadow-[0_0_20px_rgba(16,185,129,0.14)]"
                                  style={{ height }}
                                />
                              </div>
                              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/45 text-center">
                                {item.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
                  <Link
                    to="/admin/schedules"
                    className="rounded-[22px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.08]"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                      Section 01
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-emerald-50">
                      Manage Schedules
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-emerald-100/65">
                      Update collection dates and waste types.
                    </p>
                  </Link>

                  <Link
                    to="/admin/reports"
                    className="rounded-[22px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.08]"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                      Section 02
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-emerald-50">
                      Manage Reports
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-emerald-100/65">
                      Review and update report status.
                    </p>
                  </Link>

                  <Link
                    to="/admin/users"
                    className="rounded-[22px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.08]"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                      Section 03
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-emerald-50">
                      Manage Users
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-emerald-100/65">
                      Maintain users and roles.
                    </p>
                  </Link>

                  <Link
                    to="/admin/announcements"
                    className="rounded-[22px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.08]"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                      Section 04
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-emerald-50">
                      Manage Announcements
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-emerald-100/65">
                      Publish official notices and updates.
                    </p>
                  </Link>
                </section>
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.06 }}
                className="flex min-h-0 flex-col gap-4"
              >
                <section className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                        Snapshot
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-emerald-50">
                        Record composition
                      </h3>
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/60">
                      Summary
                    </div>
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-[180px_1fr] lg:items-center">
                    <div className="mx-auto flex h-[170px] w-[170px] items-center justify-center">
                      <div className="relative h-[150px] w-[150px]">
                        <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90">
                          <circle
                            cx="21"
                            cy="21"
                            r="15.915"
                            fill="transparent"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="4"
                          />
                          {donutSegments.map((segment) => (
                            <circle
                              key={segment.label}
                              cx="21"
                              cy="21"
                              r="15.915"
                              fill="transparent"
                              stroke={segment.color}
                              strokeWidth="4"
                              strokeDasharray={segment.dashArray}
                              strokeDashoffset={segment.dashOffset}
                              strokeLinecap="round"
                              pathLength="100"
                            />
                          ))}
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/45">
                            Total
                          </span>
                          <span className="mt-1 text-3xl font-bold text-emerald-50">
                            {donutTotal}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {donutValues.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm font-semibold text-emerald-50">
                              {item.label}
                            </span>
                          </div>

                          <span className="text-lg font-bold text-emerald-300">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                        Recent Reports
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-emerald-50">
                        Latest report activity
                      </h3>
                    </div>

                    <Link
                      to="/admin/reports"
                      className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/60 transition duration-300 hover:border-emerald-300/20 hover:text-emerald-50"
                    >
                      Open
                    </Link>
                  </div>

                  <div className="mt-4 space-y-3">
                    {recentReports.length > 0 ? (
                      recentReports.map((report) => (
                        <div
                          key={report._id}
                          className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3"
                        >
                          <p className="text-sm font-semibold text-emerald-50">
                            {report.location || report.barangay || "Unknown barangay"}
                          </p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-emerald-100/45">
                            {report.status || "No status"}
                          </p>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-emerald-100/65">
                            {report.issueType ||
                              report.description ||
                              report.note ||
                              "No additional details"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
                        <p className="text-sm text-emerald-100/65">
                          No recent report data available.
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                <section className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                        Recent Announcements
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-emerald-50">
                        Latest notice activity
                      </h3>
                    </div>

                    <Link
                      to="/admin/announcements"
                      className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/60 transition duration-300 hover:border-emerald-300/20 hover:text-emerald-50"
                    >
                      Open
                    </Link>
                  </div>

                  <div className="mt-4 space-y-3">
                    {recentAnnouncements.length > 0 ? (
                      recentAnnouncements.map((announcement) => (
                        <div
                          key={announcement._id}
                          className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-emerald-50">
                              {announcement.title}
                            </p>
                            <span className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
                              {announcement.targetBarangay || "All"}
                            </span>
                          </div>

                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-emerald-100/65">
                            {announcement.message || "No message"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
                        <p className="text-sm text-emerald-100/65">
                          No recent announcement data available.
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </MotionDiv>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;