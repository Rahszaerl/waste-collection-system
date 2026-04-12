import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import BackgroundFx from "../components/backgroundfx";
import { useAuth } from "../context/useAuth";
import { getAnnouncements } from "../services/announcementService";

const MotionDiv = motion.div;

const Home = () => {
  const { user } = useAuth();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements(userInfo.token);
        setAnnouncements(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setLoadingAnnouncements(false);
      }
    };

    if (userInfo?.token) {
      fetchAnnouncements();
    } else {
      setLoadingAnnouncements(false);
    }
  }, [userInfo?.token]);

  const visibleAnnouncements = useMemo(() => {
    if (!user?.barangay) return announcements;

    return announcements.filter(
      (item) =>
        item.targetBarangay === "All" || item.targetBarangay === user.barangay
    );
  }, [announcements, user?.barangay]);

  const latestAnnouncement = visibleAnnouncements[0] || null;

  const quickLinks = [
    {
      title: "Collection Schedule",
      description: "Review active and upcoming pickup schedules in your barangay.",
      to: "/schedule",
    },
    {
      title: "Submit Report",
      description: "Create a waste-related concern report with clear issue details.",
      to: "/report",
    },
    {
      title: "My Reports",
      description: "Track the status of your submitted reports and updates.",
      to: "/my-reports",
    },
  ];

  const systemHighlights = [
    "Barangay-based collection management",
    "Secure reporting and account access",
    "Organized updates for local communities",
  ];

  return (
    <div className="app-shell">
      <BackgroundFx />
      <Navbar />

      <div className="page-wrap">
        <div className="page-container space-y-6">
          <MotionDiv
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.30)] backdrop-blur-2xl sm:p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.10),transparent_34%)]" />
            <div className="absolute right-[-120px] top-[-40px] h-[240px] w-[240px] rounded-full border border-emerald-300/10" />
            <div className="absolute bottom-[-70px] left-[-70px] h-[200px] w-[200px] rounded-full border border-emerald-300/10" />

            <div className="relative z-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
              <div>
                <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-emerald-300/15 bg-white/8 px-4 py-2 backdrop-blur-xl">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.75)]" />
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100/75">
                    Community Waste Dashboard
                  </span>
                </div>

                <h1 className="max-w-3xl text-4xl font-bold leading-[0.95] tracking-[-0.05em] text-emerald-50 sm:text-5xl xl:text-6xl">
                  Welcome back, {user?.name || "User"}.
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-emerald-100/68 sm:text-base">
                  Access schedules, submit reports, and stay informed with a
                  cleaner local waste collection system designed for barangay-based
                  operations and community updates.
                </p>

                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 shadow-[0_10px_28px_rgba(0,0,0,0.16)]">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/45">
                      Barangay
                    </p>
                    <p className="mt-2 text-lg font-semibold text-emerald-50">
                      {user?.barangay || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 shadow-[0_10px_28px_rgba(0,0,0,0.16)]">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/45">
                      Account Role
                    </p>
                    <p className="mt-2 text-lg font-semibold capitalize text-emerald-50">
                      {user?.role || "User"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 shadow-[0_10px_28px_rgba(0,0,0,0.16)]">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/45">
                      Announcements
                    </p>
                    <p className="mt-2 text-lg font-semibold text-emerald-50">
                      {visibleAnnouncements.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[28px] border border-white/10 bg-black/20 p-5 shadow-[0_14px_34px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/50">
                    Latest Notice
                  </p>

                  {loadingAnnouncements ? (
                    <div className="mt-4">
                      <p className="text-sm text-emerald-100/65">
                        Loading latest announcement...
                      </p>
                    </div>
                  ) : latestAnnouncement ? (
                    <div className="mt-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold text-emerald-50">
                          {latestAnnouncement.title}
                        </h3>
                        <span className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
                          {latestAnnouncement.targetBarangay || "All"}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-7 text-emerald-100/72">
                        {latestAnnouncement.message}
                      </p>

                      <p className="mt-4 text-xs text-emerald-100/50">
                        Posted: {new Date(latestAnnouncement.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <p className="text-sm text-emerald-100/65">
                        No announcements available right now.
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                  {systemHighlights.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-4 text-sm text-emerald-100/72"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr]"
          >
            {quickLinks.map((item, index) => (
              <Link
                key={item.title}
                to={item.to}
                className="group rounded-[28px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-300/20 hover:bg-white/[0.07]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-100/45">
                  Quick Access 0{index + 1}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-emerald-50">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-emerald-100/68">
                  {item.description}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition duration-300 group-hover:text-emerald-200">
                  Open Section
                  <span className="translate-y-[1px] transition duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-xl"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/50">
                  Announcements
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-emerald-50">
                  Community updates
                </h2>
              </div>

              <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-emerald-100/55">
                {visibleAnnouncements.length} visible
              </div>
            </div>

            {loadingAnnouncements ? (
              <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-8 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-emerald-300/20 border-t-emerald-300" />
                <p className="text-sm text-emerald-100/70">
                  Loading announcements...
                </p>
              </div>
            ) : visibleAnnouncements.length === 0 ? (
              <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-8 text-center">
                <p className="text-lg font-semibold text-emerald-50">
                  No announcements yet
                </p>
                <p className="mt-2 text-sm text-emerald-100/65">
                  Official updates will appear here when posted.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {visibleAnnouncements.map((announcement) => (
                  <div
                    key={announcement._id}
                    className="rounded-[24px] border border-white/8 bg-black/20 p-5 transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.04]"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold text-emerald-50">
                        {announcement.title}
                      </h3>
                      <span className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
                        {announcement.targetBarangay || "All"}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-7 text-emerald-100/72">
                      {announcement.message}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-100/50">
                      <span>
                        Posted: {new Date(announcement.createdAt).toLocaleString()}
                      </span>
                      <span>
                        By: {announcement.createdBy?.name || "Administrator"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </MotionDiv>
        </div>
      </div>
    </div>
  );
};

export default Home;