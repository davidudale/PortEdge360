"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { RefreshCw, Search } from "lucide-react";
import { toast } from "react-toastify";
import { db } from "../../../Auth/firebase";

type UserRecord = {
  id: string;
  createdAt?: unknown;
  department?: string;
  displayName?: string;
  email?: string;
  emailVerified?: boolean;
  role?: string;
  status?: string;
};

function formatDate(value: unknown) {
  if (!value) {
    return "Not recorded";
  }

  if (value instanceof Timestamp) {
    return value.toDate().toLocaleDateString();
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate().toLocaleDateString();
  }

  return "Not recorded";
}

function getStatusLabel(user: UserRecord) {
  if (user.status) {
    return user.status.replaceAll("_", " ");
  }

  return user.emailVerified ? "active" : "pending email verification";
}

export default function SuperAdminUsersTable() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserRecord[]>([]);

  async function fetchUsers() {
    setError("");
    setIsLoading(true);

    try {
      const snapshot = await getDocs(collection(db, "users"));
      const nextUsers = snapshot.docs
        .map((userDoc): UserRecord => ({
          id: userDoc.id,
          ...userDoc.data(),
        }))
        .sort((firstUser, secondUser) =>
          (firstUser.displayName ?? firstUser.email ?? "").localeCompare(
            secondUser.displayName ?? secondUser.email ?? "",
          ),
        );

      setUsers(nextUsers);
    } catch (fetchError) {
      setError("Unable to fetch users from Firestore.");
      toast.error("Unable to fetch users from Firestore.");
      console.error(fetchError);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return users;
    }

    return users.filter((user) =>
      [
        user.displayName,
        user.email,
        user.department,
        user.role,
        user.status,
      ].some((value) => value?.toLowerCase().includes(normalizedSearch)),
    );
  }, [searchTerm, users]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Total users
          </p>
          <p className="mt-2 text-2xl font-black text-white">{users.length}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Verified
          </p>
          <p className="mt-2 text-2xl font-black text-emerald-300">
            {users.filter((user) => user.emailVerified).length}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Pending
          </p>
          <p className="mt-2 text-2xl font-black text-orange-300">
            {users.filter((user) => !user.emailVerified).length}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block sm:w-80">
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
          />
          <input
            className="h-10 w-full rounded-lg border border-white/10 bg-[#111827] pl-10 pr-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
            placeholder="Search users"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-xs font-black uppercase tracking-wider text-slate-300 transition hover:border-orange-500/40 hover:text-orange-300 disabled:cursor-wait disabled:opacity-60"
          disabled={isLoading}
          type="button"
          onClick={fetchUsers}
        >
          <RefreshCw
            aria-hidden="true"
            className={`size-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading && (
                <tr>
                  <td className="px-4 py-6 text-slate-400" colSpan={5}>
                    Loading users...
                  </td>
                </tr>
              )}

              {!isLoading && filteredUsers.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-slate-400" colSpan={5}>
                    No users found.
                  </td>
                </tr>
              )}

              {!isLoading &&
                filteredUsers.map((user) => (
                  <tr className="transition hover:bg-white/[0.03]" key={user.id}>
                    <td className="px-4 py-4">
                      <p className="font-black text-white">
                        {user.displayName || "Unnamed user"}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {user.email || "No email recorded"}
                      </p>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-300">
                      {user.role || "Unassigned"}
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-300">
                      {user.department || "Not recorded"}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-xs font-black capitalize text-orange-200">
                        {getStatusLabel(user)}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-400">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
