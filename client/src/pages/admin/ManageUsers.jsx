import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import BackgroundFx from "../../components/backgroundfx";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../../services/userService";

const MotionDiv = motion.div;

const ManageUsers = () => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(userInfo.token);
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userInfo.token]);

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role, userInfo.token);
      setUsers((prev) =>
        prev.map((user) => (user._id === id ? { ...user, role } : user))
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this user?");
    if (!confirmed) return;

    try {
      await deleteUser(id, userInfo.token);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const sidebarLinks = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/schedules", label: "Manage Schedules" },
    { to: "/admin/reports", label: "Manage Reports" },
    { to: "/admin/users", label: "Manage Users" },
  ];

  const adminCount = useMemo(
    () =>
      users.filter((user) => String(user.role || "").toLowerCase() === "admin")
        .length,
    [users]
  );

  const regularUserCount = useMemo(
    () =>
      users.filter((user) => String(user.role || "").toLowerCase() === "user")
        .length,
    [users]
  );

  const getRoleClasses = (role) => {
    const normalized = String(role || "").toLowerCase();

    if (normalized === "admin") {
      return "border-emerald-300/20 bg-emerald-400/10 text-emerald-200";
    }

    return "border-cyan-300/20 bg-cyan-400/10 text-cyan-200";
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
              User Center
            </h1>
            <p className="mt-2 text-sm leading-6 text-emerald-100/65">
              Manage user accounts, barangay assignments, and roles.
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
                User Management
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-emerald-50">
                Manage Users
              </h2>
            </div>

            <Link
              to="/home"
              className="rounded-[14px] border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-emerald-50 transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.05] xl:hidden"
            >
              Home
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <MotionDiv
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                Total Users
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-50">
                {users.length}
              </p>
              <p className="mt-2 text-sm text-emerald-100/65">
                All registered accounts
              </p>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.04 }}
              className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                Admin Accounts
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-300">
                {adminCount}
              </p>
              <p className="mt-2 text-sm text-emerald-100/65">
                Elevated role access
              </p>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.08 }}
              className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                Regular Users
              </p>
              <p className="mt-2 text-3xl font-bold text-cyan-200">
                {regularUserCount}
              </p>
              <p className="mt-2 text-sm text-emerald-100/65">
                Standard system accounts
              </p>
            </MotionDiv>
          </div>

          <MotionDiv
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="rounded-[28px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                  Records
                </p>
                <h3 className="mt-1 text-xl font-semibold text-emerald-50">
                  User accounts
                </h3>
              </div>

              <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/60">
                {users.length} total
              </div>
            </div>

            {loading ? (
              <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-8 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-emerald-300/20 border-t-emerald-300" />
                <p className="text-sm text-emerald-100/70">
                  Loading users...
                </p>
              </div>
            ) : users.length === 0 ? (
              <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-8 text-center">
                <p className="text-lg font-semibold text-emerald-50">
                  No users found
                </p>
                <p className="mt-2 text-sm text-emerald-100/65">
                  User accounts will appear here once they are registered.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="rounded-[22px] border border-white/8 bg-black/20 p-4"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-lg font-semibold text-emerald-50">
                            {user.name || "Unnamed User"}
                          </h4>
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${getRoleClasses(
                              user.role
                            )}`}
                          >
                            {user.role || "user"}
                          </span>
                        </div>

                        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
                            <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/45">
                              Email
                            </p>
                            <p className="mt-1 break-all text-sm font-medium text-emerald-50">
                              {user.email || "No email"}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
                            <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/45">
                              Barangay
                            </p>
                            <p className="mt-1 text-sm font-medium text-emerald-50">
                              {user.barangay || "No barangay"}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
                            <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/45">
                              Role
                            </p>
                            <p className="mt-1 text-sm font-medium capitalize text-emerald-50">
                              {user.role || "user"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col gap-3 xl:w-[220px]">
                        <div className="relative">
                          <select
                            className="soft-input appearance-none pr-12 text-emerald-50"
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user._id, e.target.value)
                            }
                          >
                            <option
                              value="user"
                              className="bg-[#0b1d17] text-emerald-50"
                            >
                              user
                            </option>
                            <option
                              value="admin"
                              className="bg-[#0b1d17] text-emerald-50"
                            >
                              admin
                            </option>
                          </select>

                          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-emerald-200/70">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDelete(user._id)}
                          className="rounded-[16px] border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 transition duration-300 hover:bg-red-500/15"
                        >
                          Delete User
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </MotionDiv>
        </main>
      </div>
    </div>
  );
};

export default ManageUsers;