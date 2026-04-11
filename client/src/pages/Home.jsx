import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import BackgroundFx from "../components/backgroundfx";
import { useAuth } from "../context/useAuth";

const MotionDiv = motion.div;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: "easeOut" },
});

const Home = () => {
  const { user } = useAuth();

  const quickCards = [
    {
      title: "Collection Schedule",
      text: "Monitor barangay collection timing and stay updated with the latest pickup schedule.",
      tag: "Schedule Access",
    },
    {
      title: "Waste Reports",
      text: "Submit concerns, track report progress, and manage pending requests in one place.",
      tag: "Report Management",
    },
    {
      title: "Profile Access",
      text: "Keep your personal account details updated for a smoother reporting experience.",
      tag: "User Account",
    },
  ];

  const highlights = [
    "Barangay-based local waste management",
    "Secure access for users and administrators",
    "Organized reporting and schedule tracking",
  ];

  return (
    <div className="app-shell">
      <BackgroundFx />
      <Navbar />

      <div className="page-wrap">
        <div className="page-container">
          <MotionDiv
            {...fadeUp(0)}
            className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.30)] backdrop-blur-2xl sm:p-8 xl:p-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.10),transparent_32%)]" />
            <div className="absolute right-[-80px] top-[-80px] h-[220px] w-[220px] rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute bottom-[-120px] left-[12%] h-[260px] w-[260px] rounded-full bg-teal-300/10 blur-3xl" />

            <div className="relative z-10 grid gap-8 xl:grid-cols-[1.25fr_0.75fr] xl:items-end">
              <div>
                <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-emerald-300/15 bg-white/8 px-4 py-2 backdrop-blur-xl">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.75)]" />
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100/75">
                    Waste Collection Dashboard
                  </span>
                </div>

                <h1 className="max-w-3xl text-4xl font-bold leading-[0.95] tracking-[-0.05em] text-emerald-50 sm:text-5xl xl:text-6xl">
                  Welcome back, {user?.name || "User"}.
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-emerald-100/70 sm:text-lg">
                  Access your local waste collection dashboard to review
                  schedules, submit reports, and manage your barangay-based
                  account through a cleaner and more professional system.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-100/50">
                      Barangay
                    </p>
                    <p className="mt-1 text-sm font-semibold text-emerald-50">
                      {user?.barangay || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-100/50">
                      Account Role
                    </p>
                    <p className="mt-1 text-sm font-semibold capitalize text-emerald-50">
                      {user?.role || "User"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[28px] border border-white/10 bg-black/20 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/50">
                    System Focus
                  </p>
                  <div className="mt-4 space-y-3">
                    {highlights.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3"
                      >
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.55)]" />
                        <p className="text-sm leading-6 text-emerald-50/85">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </MotionDiv>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1fr_1fr]">
            {quickCards.map((card, index) => (
              <MotionDiv
                key={card.title}
                {...fadeUp(0.1 + index * 0.08)}
                className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-300/20"
              >
                <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.12),transparent_30%)]" />

                <div className="relative z-10">
                  <div className="mb-4 inline-flex rounded-full border border-emerald-300/12 bg-emerald-300/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200/80">
                    {card.tag}
                  </div>

                  <h2 className="text-xl font-semibold tracking-tight text-emerald-50">
                    {card.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-emerald-100/68">
                    {card.text}
                  </p>

                  <div className="mt-6 glow-line" />
                </div>
              </MotionDiv>
            ))}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <MotionDiv
              {...fadeUp(0.32)}
              className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-7"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_35%)]" />

              <div className="relative z-10">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100/50">
                  Overview
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-emerald-50">
                  Professional barangay-based waste management experience
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-100/68">
                  This system is built to make local waste collection easier to
                  manage for both residents and administrators. Users can access
                  schedule details, submit reports, and review account
                  information in a cleaner environment designed for clarity and
                  speed.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
                    <p className="text-2xl font-bold text-emerald-300">01</p>
                    <p className="mt-2 text-sm text-emerald-100/70">
                      Schedule visibility
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
                    <p className="text-2xl font-bold text-emerald-300">02</p>
                    <p className="mt-2 text-sm text-emerald-100/70">
                      Report tracking
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
                    <p className="text-2xl font-bold text-emerald-300">03</p>
                    <p className="mt-2 text-sm text-emerald-100/70">
                      Localized account flow
                    </p>
                  </div>
                </div>
              </div>
            </MotionDiv>

            <MotionDiv
              {...fadeUp(0.4)}
              className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-7"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100/50">
                Account Snapshot
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/45">
                    Full Name
                  </p>
                  <p className="mt-2 text-base font-semibold text-emerald-50">
                    {user?.name || "User"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/45">
                    Barangay
                  </p>
                  <p className="mt-2 text-base font-semibold text-emerald-50">
                    {user?.barangay || "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/45">
                    Role
                  </p>
                  <p className="mt-2 text-base font-semibold capitalize text-emerald-50">
                    {user?.role || "User"}
                  </p>
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;