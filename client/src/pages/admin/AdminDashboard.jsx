import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
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

  const inProgressReports = useMemo(() => {
    return reports.filter(
      (report) => String(report.status || "").toLowerCase() === "in progress"
    ).length;
  }, [reports]);

  const resolvedReports = useMemo(() => {
    return reports.filter(
      (report) => String(report.status || "").toLowerCase() === "resolved"
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
    { name: "Users", value: users.length },
    { name: "Reports", value: reports.length },
    { name: "Schedules", value: schedules.length },
    { name: "Announcements", value: announcements.length },
    { name: "Pending", value: pendingReports },
  ];

  const reportStatusData = [
    { name: "Pending", value: pendingReports },
    { name: "In Progress", value: inProgressReports },
    { name: "Resolved", value: resolvedReports },
  ];

  const compositionData = [
    { name: "Users", value: users.length, fill: "#6ee7b7" },
    { name: "Reports", value: reports.length, fill: "#34d399" },
    { name: "Schedules", value: schedules.length, fill: "#10b981" },
    { name: "Announcements", value: announcements.length, fill: "#2dd4bf" },
  ];

  const compositionTotal = compositionData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="rounded-2xl border border-white/10 bg-[#071710]/95 px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-100/55">
          {label || payload[0]?.name}
        </p>
        <p className="mt-1 text-sm font-semibold text-emerald-50">
          {payload[0].value}
        </p>
      </div>
    );
  };

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
              Administrative access for schedules, reports, users, and official
              announcements.
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
                      Real Chart
                    </div>
                  </div>

                  <div className="mt-5 h-[260px] rounded-[20px] border border-white/8 bg-black/20 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} barCategoryGap={18}>
                        <CartesianGrid
                          stroke="rgba(255,255,255,0.06)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "rgba(236,253,245,0.55)", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fill: "rgba(236,253,245,0.45)", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Bar
                          dataKey="value"
                          radius={[14, 14, 0, 0]}
                          fill="#10b981"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                <section className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                          Report Status
                        </p>
                        <h3 className="mt-1 text-xl font-semibold text-emerald-50">
                          Workflow overview
                        </h3>
                      </div>
                    </div>

                    <div className="mt-5 h-[220px] rounded-[20px] border border-white/8 bg-black/20 p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={reportStatusData} barCategoryGap={24}>
                          <CartesianGrid
                            stroke="rgba(255,255,255,0.05)"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="name"
                            tick={{ fill: "rgba(236,253,245,0.55)", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            allowDecimals={false}
                            tick={{ fill: "rgba(236,253,245,0.45)", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip content={<CustomTooltip />} cursor={false} />
                          <Bar
                            dataKey="value"
                            radius={[12, 12, 0, 0]}
                            fill="#34d399"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                          Quick Access
                        </p>
                        <h3 className="mt-1 text-xl font-semibold text-emerald-50">
                          Management sections
                        </h3>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <Link
                        to="/admin/schedules"
                        className="rounded-[20px] border border-white/8 bg-black/20 p-4 transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.05]"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/45">
                          Section 01
                        </p>
                        <h4 className="mt-2 text-lg font-semibold text-emerald-50">
                          Schedules
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-emerald-100/65">
                          Update collection plans.
                        </p>
                      </Link>

                      <Link
                        to="/admin/reports"
                        className="rounded-[20px] border border-white/8 bg-black/20 p-4 transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.05]"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/45">
                          Section 02
                        </p>
                        <h4 className="mt-2 text-lg font-semibold text-emerald-50">
                          Reports
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-emerald-100/65">
                          Review submitted concerns.
                        </p>
                      </Link>

                      <Link
                        to="/admin/users"
                        className="rounded-[20px] border border-white/8 bg-black/20 p-4 transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.05]"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/45">
                          Section 03
                        </p>
                        <h4 className="mt-2 text-lg font-semibold text-emerald-50">
                          Users
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-emerald-100/65">
                          Maintain users and roles.
                        </p>
                      </Link>

                      <Link
                        to="/admin/announcements"
                        className="rounded-[20px] border border-white/8 bg-black/20 p-4 transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.05]"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/45">
                          Section 04
                        </p>
                        <h4 className="mt-2 text-lg font-semibold text-emerald-50">
                          Announcements
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-emerald-100/65">
                          Publish official notices.
                        </p>
                      </Link>
                    </div>
                  </div>
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
                    <div className="mx-auto h-[170px] w-[170px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={compositionData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={44}
                            outerRadius={70}
                            paddingAngle={3}
                            stroke="transparent"
                          >
                            {compositionData.map((entry) => (
                              <Cell key={entry.name} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>

                      <div className="pointer-events-none -mt-[106px] flex flex-col items-center justify-center">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/45">
                          Total
                        </span>
                        <span className="mt-1 text-3xl font-bold text-emerald-50">
                          {compositionTotal}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {compositionData.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: item.fill }}
                            />
                            <span className="text-sm font-semibold text-emerald-50">
                              {item.name}
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