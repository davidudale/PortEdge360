"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { updatePassword } from "firebase/auth";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import Link from "next/link";
import ProtectedRoute from "../../../Auth/ProtectedRoute";
import { UserRole } from "../../../Auth/roles";
import { useAuth } from "../../../Auth/AuthContext";
import { db } from "../../../Auth/firebase";

type FocusItem = string | {
  content?: ReactNode;
  description?: string;
  label: string;
  href?: string;
  icon?: ReactNode;
};

const sidebarItems = [
  {
    label: "Dashboard",
    icon: (
      <svg
        aria-hidden="true"
        className="size-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 4h6v6H4z" />
        <path d="M14 4h6v6h-6z" />
        <path d="M4 14h6v6H4z" />
        <path d="M14 14h6v6h-6z" />
      </svg>
    ),
    active: true,
  },
  {
    label: "Project Management",
    icon: ("")
  },
 
  {
    label: "Support",
    icon: (" "),
  },
  
  
];

function getInitials(value?: string) {
  if (!value) {
    return "AV";
  }

  const parts = value.trim().split(/\s+/);
  const initials = parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "AV";
}

function getFocusLabel(item: FocusItem) {
  return typeof item === "string" ? item : item.label;
}

function getFocusDescription(item: FocusItem, workspaceCopy: string) {
  if (typeof item !== "string" && item.description) {
    return item.description;
  }

  const label = getFocusLabel(item);

  return `Manage ${label.toLowerCase()} from this workspace. ${workspaceCopy}`;
}

function getFocusContent(item: FocusItem) {
  return typeof item === "string" ? null : item.content ?? null;
}

function getFocusIcon(item: FocusItem) {
  if (typeof item !== "string" && item.icon) {
    return item.icon;
  }

  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function getFocusHref(item: FocusItem, label: string) {
  if (typeof item !== "string" && item.href) {
    return item.href;
  }

  return `#${label.toLowerCase().replaceAll(" ", "-")}`;
}

function ForcePasswordChangeModal({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const { user } = useAuth();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!user) {
      setError("Your session is no longer active. Please sign in again.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSaving(true);

    try {
      await updatePassword(user, newPassword);
      await updateDoc(doc(db, "users", user.uid), {
        requirePasswordChange: false,
        status: "active",
        updatedAt: serverTimestamp(),
      });
      onComplete();
    } catch {
      setError(
        "Unable to update password. Sign out and sign in again, then retry.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      aria-labelledby="force-password-title"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/85 px-4 py-6 backdrop-blur-sm"
      role="dialog"
    >
      <form
        className="w-full max-w-md rounded-lg border border-white/10 bg-[#0f172a] p-6 shadow-2xl shadow-black/40"
        onSubmit={handleSubmit}
      >
        <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
          Security update required
        </p>
        <h2
          className="mt-3 text-2xl font-black text-white"
          id="force-password-title"
        >
          Change your temporary password
        </h2>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-400">
          Your account was created by an administrator. Set a new password before
          continuing to the dashboard.
        </p>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              New password
            </span>
            <input
              autoComplete="new-password"
              className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
              minLength={8}
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Confirm password
            </span>
            <input
              autoComplete="new-password"
              className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
              minLength={8}
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </label>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-100">
            {error}
          </p>
        )}

        <button
          className="mt-5 h-11 w-full rounded-lg bg-orange-500 px-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-orange-400 disabled:cursor-wait disabled:opacity-60"
          disabled={isSaving}
          type="submit"
        >
          {isSaving ? "Updating password..." : "Update password"}
        </button>
      </form>
    </div>
  );
}

export default function RoleDashboardShell({
  focusItems,
  role,
  workspaceCopy,
}: {
  focusItems: FocusItem[];
  role: UserRole;
  workspaceCopy: string;
}) {
  const { profile, signOutUser } = useAuth();
  const displayName = profile?.displayName ?? profile?.email ?? "Authorized user";
  const [activeMenuLabel, setActiveMenuLabel] = useState("Dashboard");
  const [passwordChangeComplete, setPasswordChangeComplete] = useState(false);
  const focusSidebarItems = focusItems.map((item) => {
    const label = getFocusLabel(item);

    return {
      label,
      content: getFocusContent(item),
      description: getFocusDescription(item, workspaceCopy),
      href: getFocusHref(item, label),
      icon: getFocusIcon(item),
    };
  });
  const navigationItems = [
    ...sidebarItems.slice(0, 1),
    ...focusSidebarItems,
    ...sidebarItems.slice(1),
  ];
  const activeMenu = navigationItems.find(
    (item) => item.label === activeMenuLabel,
  );
  const activeWorkspaceTitle =
    activeMenuLabel === "Dashboard" ? `${role} Dashboard` : activeMenuLabel;
  const activeWorkspaceCopy =
    activeMenu && "description" in activeMenu && activeMenu.description
      ? activeMenu.description
      : workspaceCopy;
  const activeWorkspaceContent =
    activeMenu && "content" in activeMenu ? activeMenu.content : null;
  const mustChangePassword =
    Boolean(profile?.requirePasswordChange) && !passwordChangeComplete;

  return (
    <ProtectedRoute allowedRoles={[role]}>
      <main className="min-h-screen bg-[#111827] text-white lg:grid lg:grid-cols-[230px_1fr]">
        {mustChangePassword && (
          <ForcePasswordChangeModal
            onComplete={() => setPasswordChangeComplete(true)}
          />
        )}
        <aside className="border-b border-white/10 bg-[#0f172a] px-3 py-7 lg:min-h-screen lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3 px-3">
            <div className="relative grid size-11 place-items-center rounded-full bg-[#020617] text-xs font-black text-white">
              {getInitials(displayName)}
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0f172a]" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-tight text-white">
                {role}
              </p>
              <p className="mt-1 max-w-32 truncate text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {displayName}
              </p>
            </div>
          </div>

          <nav className="mt-9 space-y-2" aria-label="Dashboard navigation">
            {navigationItems.map((item) => {
              const isActive = item.label === activeMenuLabel;
              const itemClassName = `flex h-10 w-full items-center justify-between rounded-lg px-3 text-left text-xs font-black transition ${
                isActive
                  ? "bg-orange-500/10 text-orange-500"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`;
              const itemContent = (
                <>
                  <span className="flex min-w-0 items-center gap-3">
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </span>
                  {!isActive && !("href" in item) && (
                    <svg
                      aria-hidden="true"
                      className="size-3 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.4"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                </>
              );

              if ("href" in item) {
                return (
                  <Link
                    className={itemClassName}
                    href={item.href}
                    key={item.label}
                    onClick={(event) => {
                      event.preventDefault();
                      setActiveMenuLabel(item.label);
                    }}
                  >
                    {itemContent}
                  </Link>
                );
              }

              return (
                <button
                  className={itemClassName}
                  key={item.label}
                  type="button"
                  onClick={() => setActiveMenuLabel(item.label)}
                >
                  {itemContent}
                </button>
              );
            })}
          </nav>

          <button
            className="mt-7 w-full rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-black uppercase tracking-wider text-red-200 transition hover:bg-red-500/20"
            type="button"
            onClick={signOutUser}
          >
            Logout
          </button>
        </aside>

        <section className="min-h-screen bg-[#111827] px-5 py-6 sm:px-7">
          <header className="flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-500">
                PortView360
              </p>
              <h1 className="mt-2 text-3xl font-black text-white">
                {activeWorkspaceTitle}
              </h1>
            </div>
           {/* <p className="max-w-sm text-sm font-medium leading-6 text-slate-400">
              {activeWorkspaceCopy}
            </p>*/}
          </header>

          {/*<div className="mt-6 grid gap-4 md:grid-cols-3">
            {focusItems.map((item, index) => {
              const label = getFocusLabel(item);

              return (
                <article
                  className="rounded-xl border border-white/10 bg-[#0f172a] p-5 shadow-xl shadow-black/20"
                  id={label.toLowerCase().replaceAll(" ", "-")}
                  key={label}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-500">
                    Focus {index + 1}
                  </p>
                  <p className="mt-3 text-2xl font-black text-white">{label}</p>
                </article>
              );
            })}
          </div>*/}

          <section className="mt-6 rounded-xl border border-white/10 bg-[#0f172a] p-5 shadow-xl shadow-black/20">
            <h2 className="text-xl font-black text-white">
              {activeWorkspaceTitle}
            </h2>
            {activeWorkspaceContent ? (
              <div className="mt-5">{activeWorkspaceContent}</div>
            ) : (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                {activeWorkspaceCopy}
              </p>
            )}
          </section>
        </section>
      </main>
    </ProtectedRoute>
  );
}
